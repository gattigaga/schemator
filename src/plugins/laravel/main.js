import pluralize from "pluralize";
import { format } from "date-fns";
import {
  createTable,
  createField,
  createOption,
  createRelation
} from "schemator-utils";

import {
  capitalize,
  toSnakeCase,
  modelTemplate,
  migrationTemplate
} from "./helpers";

// Option checkboxes would be used in table.
const tableOptions = [
  {
    id: "id",
    label: "ID"
  },
  {
    id: "rememberToken",
    label: "Remember Token"
  },
  {
    id: "softDeletes",
    label: "Soft Deletes"
  },
  {
    id: "timestamps",
    label: "Timestamps"
  }
];

// Types would be used as field type.
const fieldTypes = [
  {
    id: "bigInteger",
    label: "Big Integer"
  },
  {
    id: "binary",
    label: "Binary"
  },
  {
    id: "boolean",
    label: "Boolean"
  },
  {
    id: "char",
    label: "Char"
  },
  {
    id: "date",
    label: "Date"
  },
  {
    id: "dateTime",
    label: "Date Time"
  },
  {
    id: "dateTimeTz",
    label: "Date Time TZ"
  },
  {
    id: "decimal",
    label: "Decimal"
  },
  {
    id: "double",
    label: "Double"
  },
  {
    id: "enum",
    label: "Enum"
  },
  {
    id: "float",
    label: "Float"
  },
  {
    id: "integer",
    label: "Integer"
  },
  {
    id: "ipAddress",
    label: "IP Address"
  },
  {
    id: "json",
    label: "JSON"
  },
  {
    id: "jsonb",
    label: "JSONB"
  },
  {
    id: "longText",
    label: "Long Text"
  },
  {
    id: "macAddress",
    label: "MAC Address"
  },
  {
    id: "mediumInteger",
    label: "Medium Integer"
  },
  {
    id: "mediumText",
    label: "Medium Text"
  },
  {
    id: "morphs",
    label: "Morphs"
  },
  {
    id: "nullableMorphs",
    label: "Nullable Morphs"
  },
  {
    id: "smallInteger",
    label: "Small Integer"
  },
  {
    id: "string",
    label: "String"
  },
  {
    id: "text",
    label: "Text"
  },
  {
    id: "time",
    label: "Time"
  },
  {
    id: "timeTz",
    label: "Time TZ"
  },
  {
    id: "tinyInt",
    label: "Tiny Integer"
  },
  {
    id: "timestamp",
    label: "Timestamp"
  },
  {
    id: "timestampTz",
    label: "Timestamp TZ"
  },
  {
    id: "unsignedBigInteger",
    label: "Unsigned Big Integer"
  },
  {
    id: "unsignedInteger",
    label: "Unsigned Integer"
  },
  {
    id: "unsignedMediumInteger",
    label: "Unsigned Medium Integer"
  },
  {
    id: "unsignedSmallInteger",
    label: "Unsigned Small Integer"
  },
  {
    id: "unsignedTinyInteger",
    label: "Unsigned Tiny Integer"
  },
  {
    id: "uuid",
    label: "UUID"
  }
];

/**
 * Invoked while plugin initialized.
 * i.e. after create new project based on this extension.
 * We can initialize new scheme here.
 *
 * @returns {object} Created scheme.
 */
const onInit = () => {
  const tables = [
    createTable({
      name: "User",
      options: [
        createOption({
          id: "id",
          label: "ID",
          isChecked: true
        }),
        createOption({
          id: "rememberToken",
          label: "Remember Token",
          isChecked: true
        }),
        createOption({
          id: "softDeletes",
          label: "Soft Deletes",
          isChecked: false
        }),
        createOption({
          id: "timestamps",
          label: "Timestamps",
          isChecked: true
        })
      ],
      position: { x: 128, y: 128 }
    })
  ];

  const fields = [
    createField({
      tableID: tables[0].id,
      name: "name",
      type: "STRING"
    }),
    createField({
      tableID: tables[0].id,
      name: "email",
      type: "STRING"
    }),
    createField({
      tableID: tables[0].id,
      name: "password",
      type: "TEXT"
    })
  ];

  const scheme = {
    tables,
    fields
  };

  return scheme;
};

/**
 * Invoked while table would be created from context menu.
 * You can define table and field here.
 *
 * @param {object} cursorPosition Usually used as table position.
 * @param {number} cursorPosition.x
 * @param {number} cursorPosition.y
 * @returns {object} Created table with it's field.
 */
const onCreateTable = cursorPosition => {
  const table = createTable({
    name: "Table",
    options: [
      createOption({
        id: "id",
        label: "ID",
        isChecked: true
      }),
      createOption({
        id: "rememberToken",
        label: "Remember Token",
        isChecked: false
      }),
      createOption({
        id: "softDeletes",
        label: "Soft Deletes",
        isChecked: false
      }),
      createOption({
        id: "timestamps",
        label: "Timestamps",
        isChecked: true
      })
    ],
    position: cursorPosition
  });

  const field = createField({
    tableID: table.id,
    name: "field",
    type: "INTEGER"
  });

  const scheme = {
    table,
    field
  };

  return scheme;
};

/**
 * Invoked while field in a table would be created.
 * from context menu or button.
 * You can define field data here.
 *
 * @param {string} tableID ID of table which has this field.
 * @returns {object} Created field.
 */
const onCreateField = tableID => {
  return createField({
    tableID,
    name: "field",
    type: "INTEGER"
  });
};

/**
 * Invoked after table or field has been updated.
 * You can make relations here.
 *
 * @param {object} data Project data used for reference.
 * @param {object[]} tables All created tables.
 * @param {object[]} fields All created fields.
 * @returns {object[]} Created relations.
 */
const onUpdate = data => {
  const { tables, fields } = data;
  const foreignKeyFields = fields.filter(field => field.name.endsWith("_id"));
  const relations = foreignKeyFields.map(field => {
    const table = tables.find(table => {
      const tableName = `${table.name.toLowerCase()}_id`;
      const isMatch = field.name === tableName;

      return isMatch;
    });

    if (!table) {
      return null;
    }

    return createRelation({
      fieldID: field.id,
      fromTableID: field.tableID,
      toTableID: table.id
    });
  });

  return relations.filter(relation => !!relation);
};

/**
 * Invoked while project would be exported.
 * You can define exported data here.
 *
 * @param {string} destinationPath Path where project would be exported.
 * @param {object} data Project data used for reference.
 * @param {object[]} data.project Active project
 * @param {object[]} data.tables All created tables.
 * @param {object[]} data.fields All created fields.
 * @param {object[]} data.relations All created relations.
 * @returns {object} Paths and files which should be created.
 */
const onExport = (destinationPath, data) => {
  const byTable = tableID => field => field.tableID === tableID;

  const { project, tables, fields } = data;
  const exportPath = `${destinationPath}/${project.name}`;
  const modelPath = `${exportPath}/app`;
  const databasePath = `${exportPath}/database`;
  const migrationPath = `${databasePath}/migrations`;
  const paths = [exportPath, modelPath, databasePath, migrationPath];

  const models = tables.map(table => {
    const modelFilename = `${table.name}.php`;
    const fillable = fields.filter(byTable(table.id)).map(item => item.name);
    const model = modelTemplate(table.name, fillable);

    return {
      path: `${modelPath}/${modelFilename}`,
      content: model
    };
  });

  const migrations = tables.map(table => {
    const tableName = pluralize(toSnakeCase(table.name));
    const date = format(table.timestamp, "YYYY_MM_DD_HHmmss");
    const migrationFilename = `${date}_create_${tableName}_table.php`;
    const tableFields = fields.filter(byTable(table.id));
    const migration = migrationTemplate(table.name, table.options, tableFields);

    return {
      path: `${migrationPath}/${migrationFilename}`,
      content: migration
    };
  });

  const files = [...models, ...migrations];

  return { paths, files };
};

export default {
  tableOptions,
  fieldTypes,
  onInit,
  onCreateTable,
  onCreateField,
  onUpdate,
  onExport
};
