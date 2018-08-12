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
  "BIG_INT",
  "BINARY",
  "BOOLEAN",
  "CHAR",
  "DATE",
  "DATE_TIME",
  "DATE_TIME_TZ",
  "DECIMAL",
  "DOUBLE",
  "ENUM",
  "FLOAT",
  "INTEGER",
  "IP_ADDRESS",
  "JSON",
  "JSONB",
  "LONG_TEXT",
  "MAC_ADDRESS",
  "MEDIUM_INT",
  "MEDIUM_TEXT",
  "MORPHS",
  "NULLABLE_MORPHS",
  "SMALL_INT",
  "STRING",
  "TEXT",
  "TIME",
  "TIME_TZ",
  "TINY_INT",
  "TIMESTAMP",
  "TIMESTAMP_TZ",
  "U_BIG_INT",
  "U_INT",
  "U_MEDIUM_INT",
  "U_SMALL_INT",
  "U_TINY_INT",
  "UUID"
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
 * Invoked while table would be updated.
 * i.e. change table name only.
 *
 * @param {object} table Updated table.
 * @param {string} table.id ID of updated table.
 * @param {string} table.updatedData Updated data like table name.
 * @param {object} data Project data used for reference.
 * @param {object[]} data.tables All created tables.
 * @param {object[]} data.fields All created fields.
 * @param {object[]} data.relations All created relations.
 * @return {object[]} Created relations.
 */
const onUpdateTable = (table, data) => {
  const { fields } = data;
  const { updatedData } = table;
  const foreignKey = `${updatedData.toLowerCase()}_id`;
  const foreignFields = fields.filter(field => field.name === foreignKey);
  const relations = foreignFields.map(field =>
    createRelation({
      fieldID: field.id,
      fromTableID: field.tableID,
      toTableID: table.id
    })
  );

  return relations;
};

/**
 * Invoked while field in a table would be created
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
 * Invoked while field in a table would be updated.
 * i.e. change field name and type.
 *
 * @param {object} field Updated field.
 * @param {string} field.id ID of updated field.
 * @param {string} field.updateType Type data which has been updated (field "name" or "type").
 * @param {string} field.updateData Updated value.
 * @param {object} data Project data used for reference.
 * @param {object[]} data.tables All created tables.
 * @param {object[]} data.fields All created fields.
 * @param {object[]} data.relations All created relations.
 * @return {object} Created relation.
 */
const onUpdateField = (field, data) => {
  const { tables, fields, relations } = data;
  const { id: fieldID, updatedType, updatedData } = field;
  const relation = relations.find(item => item.fieldID === field.id);

  if (updatedType === "name") {
    if (updatedData.endsWith("_id")) {
      const lowercasedTableName = updatedData.replace("_id", "");
      const tableName = capitalize(lowercasedTableName);

      const field = fields.find(item => item.id === fieldID);
      const fromTable = tables.find(item => item.id === field.tableID);
      const toTable = tables.find(item => item.name === tableName);

      if (fromTable && toTable && !relation) {
        return {
          type: "CREATE",
          relation: createRelation({
            fieldID: field.id,
            fromTableID: fromTable.id,
            toTableID: toTable.id
          })
        };
      }
    }
  }

  return relation && { type: "DELETE", relation };
};

/**
 * Invoked while field in a table would be deleted.
 *
 * @param {object} field Deleted field.
 * @returns {boolean} Condition where relation should be removed.
 */
const onDeleteField = field => field.name.endsWith("_id");

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
  onUpdateTable,
  onCreateField,
  onUpdateField,
  onDeleteField,
  onExport
};
