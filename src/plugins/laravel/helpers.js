import pluralize from "pluralize";
import { stripIndent } from "common-tags";
import indentString from "indent-string";

/**
 * Make capital string
 *
 * @param {string} words String you want to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = words => {
  return words.charAt(0).toUpperCase() + words.substr(1);
};

/**
 * Change label field type into Laravel migration field type
 *
 * @param {string} type Field type
 * @returns {string} Laravel field type
 */
export const convertType = type => {
  const camelize = (word, index) => {
    if (index > 0) {
      return capitalize(word);
    }

    return word;
  };

  const result = type
    .toLowerCase()
    .split("_")
    .map(camelize)
    .join("");

  return result;
};

/**
 * Convert from Camel Case string to Snake Case
 *
 * @param {string} words Camel case string
 * @returns {string} Snake case string
 */
export const toSnakeCase = words => {
  const replacer = $1 => "_" + $1.toLowerCase();
  const result = words.replace(/([A-Z])/g, replacer);
  const pattern = /_*/;

  if (pattern.test(result)) {
    return result.slice(1);
  }

  return result;
};

/**
 * Create Laravel model template
 *
 * @param {string} modelName Model class name
 * @param {string[]} fields Fillable fields
 * @returns {string} Created model
 */
export const modelTemplate = (modelName, fields) => {
  const indent = 12;
  const stringifiedFields = fields.map(field => `'${field}'`).join(",\n");
  const fillable = indentString(stringifiedFields, indent).trim();

  return stripIndent(String.raw)`
    <?php

    namespace App;
    
    use Illuminate\Database\Eloquent\Model;
    
    class ${modelName} extends Model
    {
        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = [
            ${fillable}
        ];
    }`;
};

/**
 * Create Laravel migration template
 *
 * @param {string} modelName Model class name
 * @param {object} options Migration options
 * @param {boolean} options.id Use id or not
 * @param {boolean} options.timestamps Use timestamp or not
 * @param {object[]} fields Fillable field list
 * @param {string} fields[].name Field name
 * @param {string} fields[].type Field data type
 * @returns {string} Created migration
 */
export const migrationTemplate = (modelName, options, fields) => {
  const [id, rememberToken, softDeletes, timestamps] = options;
  const indent = 16;
  const tableName = pluralize(toSnakeCase(modelName));
  const className = pluralize(modelName);

  const idField = id.isChecked && `$table->increments('id');`;
  const tokenField = rememberToken.isChecked && `$table->rememberToken();`;
  const deleteField = softDeletes.isChecked && `$table->softDeletes();`;
  const timestampsField = timestamps.isChecked && `$table->timestamps();`;

  const createField = field => {
    const type = convertType(field.type);

    if (field.name.includes("_id")) {
      const singularTable = field.name.replace("_id", "");
      const tableName = pluralize(singularTable);

      return [
        `$table->integer('${field.name}')->unsigned();`,
        `$table->foreign('${
          field.name
        }')->references('id')->on('${tableName}');`
      ];
    }

    return [`$table->${type}('${field.name}');`];
  };

  const mainFields = [].concat(...fields.map(createField));

  const allFields = [
    idField,
    ...mainFields,
    tokenField,
    deleteField,
    timestampsField
  ];

  const stringifiedFields = allFields.filter(item => !!item).join("\n");
  const formatted = indentString(stringifiedFields, indent).trim();

  return stripIndent(String.raw)`
    <?php

    use Illuminate\Support\Facades\Schema;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Database\Migrations\Migration;

    class Create${className}Table extends Migration
    {
        /**
         * Run the migrations.
         *
         * @return void
         */
        public function up()
        {
            Schema::create('${tableName}', function (Blueprint $table) {
                ${formatted}
            });
        }

        /**
         * Reverse the migrations.
         *
         * @return void
         */
        public function down()
        {
            Schema::dropIfExists('${tableName}');
        }
    }`;
};
