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

  return `
    <?php

    namespace App\\Models;
    
    use Illuminate\\Database\\Eloquent\\Model;
    
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
