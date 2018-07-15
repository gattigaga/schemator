import { connect } from "react-redux";

import Alert from "../presentational/Alert";

const mapStateToProps = ({ alert }) => alert;

export default connect(mapStateToProps)(Alert);
