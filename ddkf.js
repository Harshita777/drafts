import React from "react";
import { useState } from "react";
import ExpandableTableRow from "./ExpandableTableRow";
import { Column } from "./ExpandableTableColumn";
import "./expandableTable.scss";

export interface CollapseEvent {
  timestamp: number;
  collapse: boolean | undefined;
}

interface Props {
  columns: Column[];
  data: { [key: string]: any }[];
  childDataKey?: string; //default is "child"
  rowKey?: string;
  rowColor?: (rowData: any) => string | undefined;
  visibleOnInit?: (rowData: any) => boolean;
  hideCollapseExpandButtons?: boolean;
}

const ExpandableTable: React.FC<Props> = ({
  columns,
  data,
  childDataKey,
  rowKey,
  rowColor,
  visibleOnInit,
  hideCollapseExpandButtons
}) => {
  /** An "event" used to collapse or expand all rows in the table */
  const [collapseAllEvent, setCollapseAllEvent] = useState<CollapseEvent>({
    timestamp: 0,
    collapse: undefined
  });

  const rows = data.map((value) => {
    const rowKeyValue = () => {
      if (rowKey) {
        return value[rowKey];
      } else {
        return "0" + Object.values(value).join();
      }
    };
    return (
      <ExpandableTableRow
        key={rowKeyValue()}
        collapseAllEvent={collapseAllEvent}
        hideChildren={{
          timestamp: 0,
          collapse: undefined
        }}
        data={value}
        columns={columns}
        childDataKey={childDataKey || "child"}
        childLevel={0}
        rowKey={rowKey}
        rowColor={rowColor}
        visibleOnInit={visibleOnInit}
        expandParent={() => {}}
      ></ExpandableTableRow>
    );
  });

  const renderHeaders = () => {
    return columns?.map((column) => {
      return <th key={column.title}>{column.title}</th>;
    });
  };


  return (
    <>
      <table className="collapsable-table" >
        <thead className="collapsable-table-th">
          <tr className="collapsable-table-tr">{renderHeaders()}</tr>
        </thead>
        <tbody className="collapsable-table-body">{rows}</tbody>
      </table>
    </>
  );
};

export default ExpandableTable;




@import '../../index.scss';

.collapsable-table {
    margin: auto;
    min-width: 100%;
    border-spacing: 0px;
    border-collapse: collapse;
    font-size: 14px;
  }
  
  .collapsable-table-tr {
    min-height: 57px;
    border-collapse: collapse;
  }
  
  .collapsable-table-th {
    text-align: left;
    padding: 14px 0px;
    border-bottom: 5px solid #f0f0f0;
    border-collapse: collapse;
  }
  
  .collapsable-table-td {
    width: 33.33%;
    padding: 0px;
    border-collapse: collapse;
  }
  
  .expandCollapseAll {
    border-radius: 5px;
    width: 112px;
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
    display: inline-block;
  
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    transition: filter 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    text-transform: none;
    margin: 0;
    margin-right: 10px;
    font-family: inherit;
    cursor: pointer;
  }
  
  .expandCollapseAll:hover {
    filter: brightness(95%);
  }
  
  .expandCollapseAllRow {
    padding: 10px;
  }
  
  .th-border-right {
    border-right: 1px solid #f0f0f0;
  }
  
  .icon-button {
    border: none;
    background: none;
    transition: transform 100ms ease-in-out;
    border-radius: 100%;
    padding: 3px;
    margin: 5px;
  }
  
  .icon-button:hover {
    transition: background-color 300ms ease-in-out, transform 100ms ease-in-out;
    background-color: var(--gray-4);
    cursor: pointer;
  }
  
  .icon-button.collapsed {
    transform: rotate(-90deg);
  }
  
  .icon-button span {
    padding: 10px;
    border-radius: 100%;
  }
  
  .icon-button span svg {
    fill: var(--gray-7);
  }
  
  .visHidden {
    visibility: hidden;
  }
  
  .displayNone {
    display: none;
  }
  
  .row-background-first {
    border-radius: 5px 0px 0px 5px;
  }
  
  .row-background-last {
    border-radius: 0px 5px 5px 0px;
  }
  
  .row-background-first,
  .row-background-middle,
  .row-background-last {
    min-height: 49px;
    display: flex;
    align-items: center;
  }
  
  .row-underline {
    padding: 7px 0px;
    border-bottom: 1px solid var(--gray-4);
  }
  
  .child-1 {
    padding-left: var(--spacer-width);
  }
  
  .child-2 {
    padding-left: calc(var(--spacer-width) * 2);
  }
  
  .child-3 {
    padding-left: calc(var(--spacer-width) * 3);
  }
  
  .child-4 {
    padding-left: calc(var(--spacer-width) * 4);
  }
  
  .child-6 {
    padding-left: calc(var(--spacer-width) * 6);
  }
  
  .child-7 {
    padding-left: calc(var(--spacer-width) * 7);
  }
  
  .child-8 {
    padding-left: calc(var(--spacer-width) * 8);
  }
  
  .child-9 {
    padding-left: calc(var(--spacer-width) * 9);
  }
  
  .child-10 {
    padding-left: calc(var(--spacer-width) * 10);
  }

  .expandableRow.headRow{
    background-color: #DBDDE6;
  }

  tr.expandableRow td {
    border: 1px solid;
    padding: 0px 10px;
  }

  tr.headRow span.highlight {
    background-color: #182f7c;
    padding: 10px;
    border-radius: 20px;
    color: #fff;
  }

  .collapsable-table-th th{
    padding: 10px 16px;
  }





import React from "react";
import { useEffect, useState } from "react";
import { CollapseEvent } from "./ExpandableTable";
import { Column } from "./ExpandableTableColumn";
import { ChevronDown } from '@enbdleap/react-icons'

import { ChevronDownSmall } from '@enbdleap/react-icons'

interface Props {
  data: any;
  columns: Column[];
  childLevel: number;
  childDataKey?: string;
  collapseAllEvent: CollapseEvent;
  hideChildren: CollapseEvent;
  rowKey?: string;
  rowColor?: (rowData: any) => string | undefined;
  visibleOnInit?: (rowData: any) => boolean;
  expandParent: () => void;
}

const ExpandableTableRow: React.FC<Props> = ({
  data,
  columns,
  childLevel,
  childDataKey,
  collapseAllEvent,
  hideChildren,
  rowKey,
  rowColor,
  visibleOnInit,
  expandParent
}) => {
  //controls whether child rows are displayed as well as the rotated state of the collapse icon
  const [collapsed, setCollapsed] = useState(true);

  const [hidden, setHidden] = useState(true);

  //function to be passed to the child rows, expands the parent
  const expand =
    //if this row is to be displayed on initialization, we do not want to expand it or any
    //of its children. this check can be removed to make visible all children that return true from visibleOnInit
    visibleOnInit && visibleOnInit(data)
      ? () => {}
      : () => {
          setCollapsed(false);
          setHidden(false);
          expandParent();
        };

  const collapseIconClasses = `icon-button ${collapsed ? "collapsed" : ""}`;
  const childLevelClasses = `child-${childLevel}`;
  const trClasses = `expandableRow ${childLevel === 0 ? "headRow" : ""} ${
    hidden && childLevel !== 0 ? "displayNone" : ""
  } `;
  const trStyles =
    rowColor && rowColor(data) ? { backgroundColor: rowColor(data) } : {};

  //componentDidMount
  useEffect(() => {
    if (visibleOnInit && visibleOnInit(data)) {
      expandParent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hidden) {
      //setCollapsed(true);
    }

    if (!hidden && !collapsed) {
      setHideRowChildren({ collapse: false, timestamp: Date.now() });
    }
  }, [hidden]);

  useEffect(() => {
    if (typeof collapseAllEvent.collapse == "boolean") {
      setCollapsed(collapseAllEvent.collapse);
      if (collapseAllEvent.collapse) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    }
  }, [collapseAllEvent]);

  useEffect(() => {
    if (typeof hideChildren.collapse == "boolean") {
      if (hideChildren.collapse) {
        setHidden(true);
        setHideRowChildren(hideChildren);
      } else {
        setHidden(false);
      }
    }
  }, [hideChildren]);

  const [hideRowChildren, setHideRowChildren] = useState<CollapseEvent>({
    timestamp: 0,
    collapse: undefined
  });

  const childRows: any = data[childDataKey || "child"]?.map((data: any) => {
    const rowKeyValue = () => {
      if (rowKey) {
        return data[rowKey];
      } else {
        return childLevel + Object.values(data).join();
      }
    };

    return (
      <ExpandableTableRow
        key={rowKeyValue()}
        collapseAllEvent={collapseAllEvent}
        columns={columns}
        data={data}
        childLevel={childLevel + 1}
        childDataKey={childDataKey}
        rowKey={rowKey}
        rowColor={rowColor}
        visibleOnInit={visibleOnInit}
        expandParent={expand}
        hideChildren={hideRowChildren}
      ></ExpandableTableRow>
    );
  });

  const renderCollapse = (rowData: any) => {
    if (rowData.child && rowData.child.length > 0) {
      return (
        <button
          className={collapseIconClasses}
          onClick={(e) => {
            setCollapsed(!collapsed);
            if (!collapsed) {
              //setHidden(true);
              setHideRowChildren({ collapse: true, timestamp: e.timeStamp });
            } else {
              setHideRowChildren({ collapse: false, timestamp: e.timeStamp });
            }
          }}
        >
          <ChevronDownSmall />
        </button>
      );
    } else {
      return (
        <button className={"visHidden " + collapseIconClasses}>
          <ChevronDownSmall />
        </button>
      );
    }
  };

  const renderTableDataContents = (column: Column) => {
    if (typeof column.key == "string") {
      let className =
        typeof column.class == "string" ? column.class : column.class?.[0];
      return <span className={className}>{data[column.key]}</span>;
    } else {
      return column.key.map((key, keyIndex) => {
        if (data[key]) {
          let className =
            typeof column.class == "string"
              ? column.class
              : column.class?.[keyIndex];
          //let className = classNames[columnDataIndex] || column.class;
          return (
            <span
              //key={data[rowKey] + columnData.key + columnDataIndex}
              className={className}
            >
              {data[key]}
            </span>
          );
        }
        return undefined;
      });
    }
  };

  const mapRowTd = (rowKeyValue: any, index: number, column: Column) => {
    let childClasses;
    let collapse;
    let className;

    if (index === 0) {
      childClasses = childLevelClasses;
      collapse = renderCollapse(data);
      className = "row-background-first";
    } else if (index === columns.length - 1) {
      className = "row-background-last";
    } else {
      className = "row-background-middle";
    }

    return (
      <td key={rowKeyValue + index} className={childClasses}>
        <div className={"row-underline"}>
          <div className={className} style={trStyles}>
            {collapse}
            {renderTableDataContents(column)}
          </div>
        </div>
      </td>
    );
  };

  const rowData = columns?.map((column, index, arr) => {
    const rowKeyValue = () => {
      if (rowKey) {
        return data[rowKey];
      } else {
        return childLevel + Object.values(data).join();
      }
    };

    return mapRowTd(rowKeyValue(), index, column);
  });

  const key =
    typeof columns[0].key == "string" ? columns[0].key : columns[0].key[0];
  return (
    <>
      <tr className={trClasses} key={childLevel + data[key]}>
        {rowData}
      </tr>
      {childRows}
    </>
  );
};

export default ExpandableTableRow;
