import { SET_ALERT, setAlert } from "../../actions";
import MdInfo from "react-icons/lib/md/info";

describe("SET_ALERT", () => {
  it("should return expected action", () => {
    const alert = {
      isOpen: false,
      message: "My message",
      icon: MdInfo,
      iconColor: "black"
    };

    const expected = {
      type: SET_ALERT,
      payload: alert
    };

    const action = setAlert(alert);

    expect(action).toEqual(expected);
  });
});
