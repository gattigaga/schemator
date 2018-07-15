import { connect } from "react-redux";

import RelationLines from "../presentational/RelationLines";

export const mapStateToProps = ({ tables, fields, relations }) => ({
  tables,
  fields,
  relations
});

export default connect(mapStateToProps)(RelationLines);
