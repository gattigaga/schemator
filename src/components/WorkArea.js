import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as d3 from "d3";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import { updateTable } from "../store/actions";
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
    this.removeField = this.removeField.bind(this);
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
    const { tables, modifyTable } = this.props;
    const table = tables.find(item => item.id === tableID);
    const data = {
      fields: [
        ...table.fields,
        {
          id: uuid(),
          name: "field",
          type: "INTEGER"
        }
      ]
    };

    modifyTable(tableID, data);
  }

  /**
   * Remove existing field inside table
   *
   * @param {number} tableID Table ID
   * @memberof WorkArea
   */
  removeField(tableID) {
    const { tables, modifyTable } = this.props;
    const table = tables.find(item => item.id === tableID);

    return fieldID => {
      const data = {
        fields: table.fields.filter(item => item.id !== fieldID)
      };

      modifyTable(tableID, data);
    };
  }

  /**
   * Remove existing field inside table
   *
   * @param {number} tableID Table ID
   * @param {string} type Input type
   * @memberof WorkArea
   */
  updateField(tableID, type) {
    const { tables, modifyTable } = this.props;
    const table = tables.find(item => item.id === tableID);

    return (event, fieldID) => {
      const data = {
        fields: table.fields.map(item => {
          if (item.id === fieldID) {
            return {
              ...item,
              [type]: event.target.value
            };
          }

          return item;
        })
      };

      modifyTable(tableID, data);
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
    const { tables } = this.props;

    return (
      <Container>
        <Area
          innerRef={this.area}
          onMouseUp={event => {
            this.activeTable = null;
          }}
        >
          {tables.map((table, index) => (
            <TableBox
              key={table.id}
              ref={this.tables[index]}
              {...table}
              onMouseDown={this.saveTableOffset(index)}
              onMouseMove={this.updateTablePosition(table.id)}
              onClickAddField={() => this.addField(table.id)}
              onClickRemoveField={this.removeField(table.id)}
              onChangeFieldName={this.updateField(table.id, "name")}
              onChangeFieldType={this.updateField(table.id, "type")}
              onChangeName={this.updateTableName(table.id)}
            />
          ))}
        </Area>
      </Container>
    );
  }
}

WorkArea.propTypes = {
  tables: PropTypes.array,
  modifyTable: PropTypes.func
};

const mapStateToProps = ({ tables }) => ({ tables });

const mapDispatchToProps = dispatch => ({
  modifyTable: (id, data) => dispatch(updateTable(id, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
