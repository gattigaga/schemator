import { modelTemplate } from "../../template";

describe("modelTemplate()", () => {
  it("should returns created model", () => {
    const expected = `
    <?php

    namespace App\\Models;
    
    use Illuminate\\Database\\Eloquent\\Model;
    
    class User extends Model
    {
        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = [
            'username',
            'email',
            'fullname',
        ];
    }`;
    const fields = ["username", "email", "fullname"];
    const result = modelTemplate("User", fields);

    expect(result).toEqual(expected);
  });
});
