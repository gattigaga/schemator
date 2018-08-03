const dataType = [
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

// Invoked while plugin activated.
// i.e. after create new project based on this extension.
const onActivate = () => {};

// Invoked while table would be created.
// You can define table data here.
const onCreateTable = () => {};

// Invoked while table would be updated.
// i.e. change table name.
const onUpdateTable = () => {};

// Invoked while table would be deleted.
// You can remove table relation here.
const onDeleteTable = () => {};

// Invoked while field in a table would be created.
// You can define field data here.
const onCreateField = () => {};

// Invoked while field in a table would be updated.
// i.e. change field name and type.
const onUpdateField = () => {};

// Invoked while field in a table would be deleted.
const onDeleteField = () => {};

// Invoked while option checkbox in a table would be updated.
// i.e. checked or unchecked.
const onUpdateOption = () => {};

// Invoked while project would be exported.
// You can define exported data here.
const onExport = () => {};

export default {
  onActivate,
  onCreateTable,
  onUpdateTable,
  onDeleteTable,
  onCreateField,
  onUpdateField,
  onDeleteField,
  onUpdateOption,
  onExport
};
