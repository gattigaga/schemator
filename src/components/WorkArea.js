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
  updateTable,
  removeRelation
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

const RelationLine = styled.path`
  fill: none;
  stroke: white;
  stroke-width: 2px;
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

    this.getPathPoints = this.getPathPoints.bind(this);
    this.getMousePosition = this.getMousePosition.bind(this);
    this.saveTableOffset = this.saveTableOffset.bind(this);
    this.addField = this.addField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.updateTableName = this.updateTableName.bind(this);
    this.updateTablePosition = this.updateTablePosition.bind(this);
  }

  componentDidMount() {
    this.createLines();
  }

  /**
   * Get relation line path points
   *
   * @param {object} fromTablePosition Position of table which has foreign key
   * @param {number} fromTablePosition.x Position X
   * @param {number} fromTablePosition.y Position Y
   * @param {object} toTablePosition Position of destination table
   * @param {number} toTablePosition.x Position X
   * @param {number} toTablePosition.y Position Y
   * @param {number} fieldIndex Index of foreign key field relative from it's table
   * @returns {string} Path points
   * @memberof WorkArea
   */
  getPathPoints(fromTablePosition, toTablePosition, fieldIndex) {
    const { x: fPosX, y: fPosY } = fromTablePosition;
    const { x: tPosX, y: tPosY } = toTablePosition;
    const headerHeight = 36;
    const inputHeight = 38;
    const tableWidth = 240;
    const curvePoint = 64;
    const halfHeaderHeight = headerHeight / 2;
    const inputY = headerHeight + fieldIndex * inputHeight + inputHeight / 2;
    const isFromTableInRight = fPosX > tPosX;
    let points = "";

    if (isFromTableInRight) {
      points = `
        M${fPosX + halfHeaderHeight} ${fPosY + inputY} 
        C${fPosX - curvePoint} ${fPosY + inputY} 
          ${tPosX + tableWidth + curvePoint} ${tPosY + halfHeaderHeight} 
          ${tPosX + tableWidth} ${tPosY + halfHeaderHeight}
      `;
    } else {
      points = `
        M${fPosX + tableWidth - halfHeaderHeight} ${fPosY + inputY} 
        C${fPosX + tableWidth + curvePoint} ${fPosY + inputY} 
          ${tPosX - curvePoint} ${tPosY + halfHeaderHeight} 
          ${tPosX + halfHeaderHeight} ${tPosY + halfHeaderHeight}
      `;
    }

    return points;
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
   * Remove existing field
   *
   * @param {number} fieldID Field ID
   * @memberof WorkArea
   */
  removeField(fieldID) {
    const { fields, relations, deleteField, deleteRelation } = this.props;
    const field = fields.find(item => item.id === fieldID);
    const relation = relations.find(item => item.fieldID === fieldID);

    if (field.name.includes("_id") && relation) {
      deleteRelation(relation.id);
    }

    deleteField(fieldID);
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
    const { tables, fields, relations } = this.props;
    const byTableID = tableID => item => item.tableID === tableID;
    const byID = itemID => item => item.id === itemID;

    return (
      <Container>
        <Area
          innerRef={this.area}
          onMouseUp={event => {
            this.activeTable = null;
          }}
        >
          {relations.map(relation => {
            const { fieldID, fromTableID, toTableID } = relation;
            const fieldIndex = fields
              .filter(byTableID(fromTableID))
              .findIndex(byID(fieldID));
            const fromTable = tables.find(byID(fromTableID));
            const toTable = tables.find(byID(toTableID));

            if (fromTable && toTable) {
              const points = this.getPathPoints(
                fromTable.position,
                toTable.position,
                fieldIndex
              );
              return <RelationLine key={relation.id} d={points} />;
            }

            return null;
          })}
          {tables.map((table, index) => {
            const currentFields = fields.filter(byTableID(table.id));

            return (
              <TableBox
                key={table.id}
                ref={this.tables[index]}
                {...table}
                fields={currentFields}
                onMouseDown={this.saveTableOffset(index)}
                onMouseMove={this.updateTablePosition(table.id)}
                onClickAddField={() => this.addField(table.id)}
                onClickRemoveField={this.removeField}
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
  relations: PropTypes.array,
  modifyTable: PropTypes.func,
  modifyField: PropTypes.func,
  createField: PropTypes.func,
  deleteField: PropTypes.func,
  deleteRelation: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  createField: field => dispatch(addField(field)),
  deleteField: fieldID => dispatch(removeField(fieldID)),
  modifyTable: (id, data) => dispatch(updateTable(id, data)),
  modifyField: (id, data) => dispatch(updateField(id, data)),
  deleteRelation: relationID => dispatch(removeRelation(relationID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArea);
