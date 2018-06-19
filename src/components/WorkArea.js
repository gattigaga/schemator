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

    this.area = createRef();
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.updateField = this.updateField.bind(this);
    this.updateTableName = this.updateTableName.bind(this);
  }

  componentDidMount() {
    this.createLines();
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

  render() {
    const { tables } = this.props;

    return (
      <Container>
        <Area innerRef={this.area}>
          {tables.map(table => (
            <TableBox
              key={table.id}
              {...table}
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
