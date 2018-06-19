import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as d3 from "d3";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import {
  addField,
  updateField,
  removeField,
  updateTable
} from "../store/actions";
import TableBox from "./TableBox";

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Area = styled.svg`
  flex: 1;
  background: #333;
`;

class WorkArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: {
        x: 0,
        y: 0
      }
    };

    this.area = createRef();
    this.activeTable = null;
    this.tables = props.tables.map(createRef);

    this.getMousePosition = this.getMousePosition.bind(this);
    this.saveTableOffset = this.saveTableOffset.bind(this);
    this.addField = this.addField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.updateTableName = this.updateTableName.bind(this);
    this.updateTablePosition = this.updateTablePosition.bind(this);
  }

  componentDidMount() {
    this.createLines();
  }

  /**
   * Get mouse position in SVG coordinate system
   *
   * @param {object} event DOM event
   * @returns {object} Mouse position
   * @memberof WorkArea
   */
  getMousePosition(event) {
    const ctm = this.area.current.getScreenCTM();

    return {
      x: (event.clientX - ctm.e) / ctm.a,
      y: (event.clientY - ctm.f) / ctm.d
    };
  }

  /**
   * Save table offset from the top left of object
   *
   * @param {number} tableIndex Table index
   * @memberof WorkArea
   */
  saveTableOffset(tableIndex) {
    return event => {
      this.activeTable = this.tables[tableIndex];

      const getAttributeNS = attr => {
        const activeTableDOM = this.activeTable.current;
        return parseFloat(activeTableDOM.getAttributeNS(null, attr));
      };
      const offset = this.getMousePosition(event);

      offset.x -= getAttributeNS("x");
      offset.y -= getAttributeNS("y");

      this.setState({ offset });
    };
  }

  /**
   * Create guide lines
   *
   * @memberof WorkArea
   */
  createLines() {
    const parent = d3.select(this.area.current);
    const gap = 16;
    const totalHorizontalLines = parseInt(this.area.current.clientHeight / gap);
    const totalVerticalLines = parseInt(this.area.current.clientWidth / gap);

    [...Array(totalHorizontalLines)].forEach((_, index) => {
      const y = (index + 1) * gap;

      parent
        .insert("line", "*")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", "100%")
        .attr("y2", y)
        .attr("stroke", "#3a3a3a")
        .attr("stroke-width", 1)
        .attr("shape-rendering", "crispEdges");
    });

    [...Array(totalVerticalLines)].forEach((_, index) => {
      const x = (index + 1) * gap;

      parent
        .insert("line", "*")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", "100%")
        .attr("stroke", "#3a3a3a")
        .attr("stroke-width", 1)
        .attr("shape-rendering", "crispEdges");
    });
  }

  /**
   * Add new field inside table
   *
   * @param {number} tableID Table ID
   * @memberof WorkArea
   */
  addField(tableID) {
    const { createField } = this.props;
    const data = {
      tableID,
      id: uuid(),
      name: "field",
      type: "INTEGER"
    };

    createField(data);
  }

  /**
   * Update field data inside table
   *
   * @param {string} type Input type
   * @memberof WorkArea
   */
  updateField(type) {
    const { modifyField } = this.props;

    return (event, fieldID) => {
      const data = {
        [type]: event.target.value
      };

      modifyField(fieldID, data);
    };
  }

  /**
   * Update table name
   *
   * @param {number} tableID Table ID
   * @memberof WorkArea
   */
  updateTableName(tableID) {
    const { modifyTable } = this.props;

    return event => {
      const data = {
        name: event.target.value
      };

      modifyTable(tableID, data);
    };
  }

  /**
   * Update table position
   *
   * @param {object} event DOM event
   * @memberof WorkArea
   */
  updateTablePosition(tableID) {
    const { offset } = this.state;
    const { modifyTable } = this.props;

    return event => {
      if (this.activeTable) {
        event.preventDefault();

        const activeTableDOM = this.activeTable.current;
        const coord = this.getMousePosition(event);
        const x = coord.x - offset.x;
        const y = coord.y - offset.y;

        activeTableDOM.setAttributeNS(null, "x", x);
        activeTableDOM.setAttributeNS(null, "y", y);

        modifyTable(tableID, {
          position: { x, y }
        });
      }
    };
  }

  render() {
    const { tables, fields, deleteField } = this.props;

    return (
      <Container>
        <Area
          innerRef={this.area}
          onMouseUp={event => {
            this.activeTable = null;
          }}
        >
          {tables.map((table, index) => {
            const byTableID = field => field.tableID === table.id;
            const currentFields = fields.filter(byTableID);

            return (
              <TableBox
                key={table.id}
                ref={this.tables[index]}
                {...table}
                fields={currentFields}
                onMouseDown={this.saveTableOffset(index)}
                onMouseMove={this.updateTablePosition(table.id)}
                onClickAddField={() => this.addField(table.id)}
                onClickRemoveField={deleteField}
                onChangeFieldName={this.updateField("name")}
                onChangeFieldType={this.updateField("type")}
                onChangeName={this.updateTableName(table.id)}
              />
            );
          })}
        </Area>
      </Container>
    );
  }
}

WorkArea.propTypes = {
  tables: PropTypes.array,
  fields: PropTypes.array,
  modifyTable: PropTypes.func,
  modifyField: PropTypes.func,
  createField: PropTypes.func,
  deleteField: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(addField(field)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  modifyTable: (id, data) => dispatch(updateTable(id, data)),
  modifyField: (id, data) => dispatch(updateField(id, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
