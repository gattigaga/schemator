import { setAlert } from "../../actions";
import { alert } from "../../reducers";
import MdInfo from "react-icons/lib/md/info";

describe("alert()", () => {
  it("should returns initial state", () => {
    const expected = {
      isOpen: false,
      message: "My message",
      icon: MdInfo,
      iconColor: "black"
    };

    const result = alert(undefined, {});

    expect(result).toEqual(expected);
  });

  it("should set alert", () => {
    const myAlert = {
      isOpen: true,
      message: "My message again",
      icon: MdInfo,
      iconColor: "black"
    };

    const expected = myAlert;
    const action = setAlert(myAlert);
    const result = alert(undefined, action);

    expect(result).toEqual(expected);
  });
});
