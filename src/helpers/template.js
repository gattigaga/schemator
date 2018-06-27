import pluralize from "pluralize";

import { convertType, capitalize } from "./formatter";

/**
 * Create Laravel model template
 *
 * @param {string} modelName Model class name
 * @param {string[]} fields Fillable fields
 * @returns {string} Created model
 */
export const modelTemplate = (modelName, fields) => {
  const createField = (field, index) => {
    const tabs = index > 0 ? " ".repeat(12) : "";
    const newLine = index < fields.length - 1 ? "\n" : "";
    return `${tabs}'${field}',${newLine}`;
  };

  const fillable = fields.map(createField).join("");

  return String.raw`
    <?php

    namespace App\Models;
    
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
  const { id, rememberToken, softDeletes, timestamps } = options;
  const spaces = " ".repeat(16);
  const tableName = pluralize(modelName.toLowerCase());
  const className = capitalize(tableName);
  let end = "";

  end = rememberToken || softDeletes || timestamps ? "\n" : "";
  const idField = id && `$table->increments('id');${end}`;
  end = softDeletes || timestamps ? "\n" : "";
  const tokenField = rememberToken && `${spaces}$table->rememberToken();${end}`;
  end = timestamps ? "\n" : "";
  const deleteField = softDeletes && `${spaces}$table->softDeletes();${end}`;
  const timestampsField = timestamps && `${spaces}$table->timestamps();`;

  const createField = (field, index) => {
    let tabs = id ? spaces : "";

    if (index > 0) {
      tabs = spaces;
    }

    const newLine = softDeletes || timestamps ? "\n" : "";
    const type = convertType(field.type);
    return `${tabs}$table->${type}('${field.name}');${newLine}`;
  };
  const mainFields = fields.map(createField);

  const allFields = [
    idField,
    ...mainFields,
    tokenField,
    deleteField,
    timestampsField
  ];

  const formatted = allFields.filter(item => !!item).join("");

  return String.raw`
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
