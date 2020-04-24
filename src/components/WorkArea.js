import React, { useState, useEffect, useRef, createRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { updateProject } from "../store/actions/project";
import { addTable, setTables, updateTable } from "../store/actions/tables";
import {
  addField,
  setFields,
  removeField,
  updateField,
} from "../store/actions/fields";
import { setRelations } from "../store/actions/relations";
import BGLines from "./BGLines";
import RelationLines from "./RelationLines";
import Table from "./Table";

const { remote } = window.require("electron");

const Container = styled.div`
  flex: 1;
  overflow: ${({ isScrollable }) => (isScrollable ? "scroll" : "hidden")};
  height: calc(100vh - 24px);
`;

const Area = styled.svg`
  width: 100%;
  height: 100%;
  background: #333;
  transform-origin: top left;
`;

const WorkArea = () => {
  const { Menu } = remote;

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const area = useRef(null);
  const activeTable = useRef(null);
  const hoveredTable = useRef(null);
  const menu = useRef(new Menu());
  const dispatch = useDispatch();

  const { plugin, project, tables, fields, relations } = useSelector(
    ({ plugin, project, tables, fields, relations }) => ({
      plugin,
      project,
      tables,
      fields,
      relations,
    })
  );

  const appWindow = remote.getCurrentWindow();
  const zoom = project ? project.zoom / 100 : 1;
  const areaWidth = area.current ? area.current.clientWidth : 1366;
  const areaHeight = area.current ? area.current.clientHeight : 696;
  const gap = 32;
  const width = (areaWidth / 25) * 100;
  const height = (areaHeight / 25) * 100;
  const totalHorizontalLines = Math.trunc(width / gap);
  const totalVerticalLines = Math.trunc(height / gap);
  const [menuAddTable, menuRemoveTable, menuAddField] = menu.current.items;
  const types = plugin ? plugin.main.fieldTypes : [];

  const coordinates = relations
    .map((relation) => {
      const byTableID = (tableID) => (item) => item.tableID === tableID;
      const byID = (itemID) => (item) => item.id === itemID;

      const { fieldID, fromTableID, toTableID } = relation;
      // Table which contains foreign key
      const fromTable = tables.find(byID(fromTableID));
      // Table as a destination
      const toTable = tables.find(byID(toTableID));
      // Index of foreign key field
      const fieldIndex = fields
        .filter(byTableID(fromTableID))
        .findIndex(byID(fieldID));

      return { fromTable, toTable, fieldIndex };
    })
    .filter(({ fromTable, toTable }) => fromTable && toTable)
    .map((relation) => {
      const { fromTable, toTable, fieldIndex } = relation;
      const { position: fromPos } = fromTable;
      const { position: toPos } = toTable;
      const tableWidth = 240;
      // Height of Table part (i.e. header, input or option)
      const chunkHeight = 36;

      const coordinate = {
        x1: toPos.x <= fromPos.x ? toPos.x + tableWidth : toPos.x,
        y1: toPos.y + chunkHeight / 2,
        x2: fromPos.x <= toPos.x ? fromPos.x + tableWidth : fromPos.x,
        y2: fromPos.y + chunkHeight * (fieldIndex + 1) + chunkHeight / 2,
      };

      return coordinate;
    });

  const createContextMenu = () => {
    const { MenuItem } = remote;

    menu.current = new Menu();

    menu.current.append(
      new MenuItem({
        label: "Add Table",
        visible: false,
        click: createTable,
      })
    );

    menu.current.append(
      new MenuItem({
        label: "Remove Table",
        visible: false,
        click: deleteTable,
      })
    );

    menu.current.append(
      new MenuItem({
        label: "Add Field",
        visible: false,
        click: () => createField(hoveredTable.current),
      })
    );
  };

  const setAreaSize = () => {
    const { workAreaSize } = remote.screen.getPrimaryDisplay();
    const width = (workAreaSize.width / 25) * 100;
    const height = ((workAreaSize.height - 48) / 25) * 100;

    area.current.style.width = `${width}px`;
    area.current.style.height = `${height}px`;
  };

  const createTable = () => {
    const { onCreateTable, onUpdate } = plugin.main;
    const { table, fields: newFields = [] } = onCreateTable(mouse) || {};

    if (table && newFields) {
      const newTable = { ...table, ref: createRef() };

      const data = {
        tables: [...tables, newTable],
        fields: [...fields, ...newFields],
      };

      const relations = onUpdate(data) || [];

      dispatch(setRelations(relations));
      dispatch(addTable(newTable));
      dispatch(updateProject({ isModified: true }));

      newFields.forEach((field) => dispatch(addField(field)));
    }
  };

  const deleteTable = () => {
    const { onUpdate } = plugin.main;
    const tableID = hoveredTable.current;
    const newTables = tables.filter((table) => table.id !== tableID);
    const newFields = fields.filter((field) => field.tableID !== tableID);

    const data = {
      tables: newTables,
      fields: newFields,
    };

    const relations = onUpdate(data) || [];

    dispatch(setRelations(relations));
    dispatch(setTables(newTables));
    dispatch(setFields(newFields));
    dispatch(updateProject({ isModified: true }));
  };

  const createField = (tableID) => {
    const { onCreateField, onUpdate } = plugin.main;
    const field = onCreateField(tableID);

    if (field) {
      const newFields = [...fields, field];
      const data = {
        tables,
        fields: newFields,
      };
      const relations = onUpdate(data) || [];

      dispatch(setRelations(relations));
      dispatch(addField(field));
      dispatch(updateProject({ isModified: true }));
    }
  };

  const setZoom = (event) => {
    const { deltaY, ctrlKey } = event;

    if (project && ctrlKey) {
      const zoomValues = [25, 33, 50, 67, 75, 80, 90, 100];
      const totalValues = zoomValues.length;
      const { zoom } = project;
      const offset = deltaY > 0 ? -1 : 1;
      const index = zoomValues.findIndex((item) => item === zoom);
      const newIndex = index + offset;
      const isOutOfBound = newIndex < 0 || newIndex > totalValues - 1;

      if (!isOutOfBound) {
        const newZoom = zoomValues[newIndex];

        dispatch(updateProject({ zoom: newZoom }));
      }
    }
  };

  const getMousePosition = (event) => {
    const ctm = area.current.getScreenCTM();

    return {
      x: (event.clientX - ctm.e) / ctm.a,
      y: (event.clientY - ctm.f) / ctm.d,
    };
  };

  const saveTableOffset = (event, tableID) => {
    const byID = (item) => item.id === tableID;

    activeTable.current = tables.find(byID).ref.current;

    if (activeTable.current) {
      const getAttributeNS = (attr) => {
        const value = activeTable.current.getAttributeNS(null, attr);
        return parseFloat(value);
      };

      const newOffset = getMousePosition(event);

      newOffset.x -= getAttributeNS("x");
      newOffset.y -= getAttributeNS("y");

      setOffset(newOffset);
    }
  };

  const editField = (event, fieldID, type) => {
    const { value } = event.target;
    const { onUpdate } = plugin.main;
    const updatedData = { [type]: value };

    const newFields = fields.map((field) => {
      if (field.id === fieldID) {
        return { ...field, ...updatedData };
      }

      return field;
    });

    const data = {
      tables,
      fields: newFields,
    };

    const relations = onUpdate(data) || [];

    dispatch(setRelations(relations));
    dispatch(updateField(fieldID, updatedData));
    dispatch(updateProject({ isModified: true }));
  };

  const deleteField = (fieldID) => {
    const { onUpdate } = plugin.main;
    const newFields = fields.filter((item) => item.id !== fieldID);

    const data = {
      tables,
      fields: newFields,
    };

    const relations = onUpdate(data) || [];

    dispatch(setRelations(relations));
    dispatch(removeField(fieldID));
    dispatch(updateProject({ isModified: true }));
  };

  const updateTableName = (event, tableID) => {
    const { value } = event.target;
    const { onUpdate } = plugin.main;
    const updatedData = { name: value };

    const newTables = tables.map((table) => {
      if (table.id === tableID) {
        return { ...table, ...updatedData };
      }

      return table;
    });

    const data = {
      tables: newTables,
      fields,
    };

    const relations = onUpdate(data) || [];

    dispatch(setRelations(relations));
    dispatch(updateTable(tableID, updatedData));
    dispatch(updateProject({ isModified: true }));
  };

  const updateTablePosition = (event, tableID) => {
    if (activeTable.current) {
      event.preventDefault();

      const activeTableDOM = activeTable.current;
      const coord = getMousePosition(event);
      const x = coord.x - offset.x;
      const y = coord.y - offset.y;

      activeTableDOM.setAttributeNS(null, "x", x);
      activeTableDOM.setAttributeNS(null, "y", y);

      dispatch(
        updateTable(tableID, {
          position: { x, y },
        })
      );
      dispatch(updateProject({ isModified: true }));
    }
  };

  useEffect(() => {
    createContextMenu();
  }, [plugin, tables, fields]);

  useEffect(() => {
    setAreaSize();
  }, [project]);

  return (
    <Container isScrollable={!!project}>
      <Area
        ref={area}
        style={{ zoom }}
        onWheel={setZoom}
        onContextMenu={(event) => {
          menu.current.popup({ window: appWindow });

          setMouse({
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onMouseEnter={() => {
          if (menuAddTable) {
            menuAddTable.visible = !!project;
          }
        }}
        onMouseLeave={() => {
          if (menuAddTable) {
            menuAddTable.visible = false;
          }
        }}
      >
        <BGLines
          totalHorizontal={totalHorizontalLines}
          totalVertical={totalVerticalLines}
          gap={32}
        />
        <g>
          <RelationLines items={coordinates} />
          {tables.map((table) => {
            const byTableID = ({ tableID }) => tableID === table.id;
            const currentFields = fields.filter(byTableID);

            return (
              <Table
                key={table.id}
                ref={table.ref}
                name={table.name}
                position={table.position}
                types={types}
                fields={currentFields}
                onMouseDown={(event) => saveTableOffset(event, table.id)}
                onMouseUp={() => {
                  activeTable.current = null;
                }}
                onMouseMove={(event) => updateTablePosition(event, table.id)}
                onMouseEnter={() => {
                  if (menuAddTable) {
                    menuAddTable.visible = false;
                  }

                  if (menuRemoveTable) {
                    menuRemoveTable.visible = true;
                  }

                  if (menuAddField) {
                    menuAddField.visible = true;
                  }
                }}
                onMouseLeave={() => {
                  activeTable.current = null;

                  if (menuAddTable) {
                    menuAddTable.visible = true;
                  }

                  if (menuRemoveTable) {
                    menuRemoveTable.visible = false;
                  }

                  if (menuAddField) {
                    menuAddField.visible = false;
                  }
                }}
                onContextMenu={() => {
                  hoveredTable.current = table.id;
                }}
                onClickAddField={() => createField(table.id)}
                onClickRemoveField={(field) => deleteField(field.id)}
                onChangeFieldName={(event, field) =>
                  editField(event, field.id, "name")
                }
                onChangeFieldType={(event, field) =>
                  editField(event, field.id, "type")
                }
                onChangeName={(event) => updateTableName(event, table.id)}
              />
            );
          })}
        </g>
      </Area>
    </Container>
  );
};

export default WorkArea;
