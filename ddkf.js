import React, { useEffect, useState } from "react";
import { CollapseEvent } from "./ExpandableTable";
import { Column } from "./ExpandableTableColumn";
import { ChevronDownSmall } from "@enbdleap/react-icons";

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
  expandParent,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [hidden, setHidden] = useState(true);

  const expand = visibleOnInit && visibleOnInit(data)
    ? () => {}
    : () => {
        setCollapsed(false);
        setHidden(false);
        expandParent();
      };

  const collapseIconClasses = `transition-transform transform ${collapsed ? "rotate-0" : "rotate-180"}`;
  const trClasses = `${childLevel === 0 ? "bg-gray-100" : "bg-white"} ${hidden && childLevel !== 0 ? "hidden" : ""}`;
  const trStyles = rowColor && rowColor(data) ? { backgroundColor: rowColor(data) } : {};

  useEffect(() => {
    if (visibleOnInit && visibleOnInit(data)) {
      expandParent();
    }
  }, []);

  useEffect(() => {
    if (!hidden && !collapsed) {
      setHideRowChildren({ collapse: false, timestamp: Date.now() });
    }
  }, [hidden]);

  useEffect(() => {
    if (typeof collapseAllEvent.collapse === "boolean") {
      setCollapsed(collapseAllEvent.collapse);
      setHidden(collapseAllEvent.collapse);
    }
  }, [collapseAllEvent]);

  useEffect(() => {
    if (typeof hideChildren.collapse === "boolean") {
      setHidden(hideChildren.collapse);
      setHideRowChildren(hideChildren);
    }
  }, [hideChildren]);

  const [hideRowChildren, setHideRowChildren] = useState<CollapseEvent>({
    timestamp: 0,
    collapse: undefined,
  });

  const childRows = data[childDataKey || "child"]?.map((childData: any) => (
    <tr key={rowKey ? childData[rowKey] : childLevel + Object.values(childData).join()} className={`bg-gray-50 ${collapsed ? "hidden" : ""}`}>
      <td className="pl-12 py-2 text-sm text-gray-600" colSpan={columns.length}>
        {/* Render child data here, adjust as needed */}
        <div>{childData.transactionType}</div>
        <div>{childData.subProduct}</div>
      </td>
    </tr>
  ));

  const renderCollapse = (rowData: any) => (
    <button
      className={`text-gray-600 focus:outline-none ${collapseIconClasses}`}
      onClick={(e) => {
        setCollapsed(!collapsed);
        setHideRowChildren({ collapse: !collapsed, timestamp: e.timeStamp });
      }}
    >
      <ChevronDownSmall />
    </button>
  );

  const renderTableDataContents = (column: Column) => {
    if (typeof column.key === "string") {
      return <span className={column.class}>{data[column.key]}</span>;
    } else {
      return column.key.map((key, keyIndex) => (
        data[key] && (
          <span key={key} className={column.class?.[keyIndex]}>
            {data[key]}
          </span>
        )
      ));
    }
  };

  const mapRowTd = (index: number, column: Column) => (
    <td key={index} className={`${childLevel === 0 ? "py-4 px-6" : "pl-10 py-4 px-6"}`}>
      <div className="border-b border-gray-200">
        <div className={trStyles}>
          {index === 0 && renderCollapse(data)}
          {renderTableDataContents(column)}
        </div>
      </div>
    </td>
  );

  const rowData = columns.map((column, index) => mapRowTd(index, column));

  const key = typeof columns[0].key === "string" ? columns[0].key : columns[0].key[0];

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
