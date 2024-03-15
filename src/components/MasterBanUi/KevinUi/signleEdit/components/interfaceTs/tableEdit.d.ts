interface SubTableButtonInfo {
    actionStatusEvents?: string;
    events?: string;
}

interface TableColumnInfo {
    // 定义 TableColumnInfo 的结构...
    slotRenderEvents?: string;
}

export interface MainTableActionButtonInfo {
    label?: string;
    isHide?: boolean;
    events?: string;
    slotRenderEvents?: string;
}

interface MainParams {
    haveChild: boolean;
    anchorPoint: string;
    tableSlotButtons: MainTableActionButtonInfo[];
    childTableSlotButtons: SubTableButtonInfo[];
    tableColumns: TableColumnInfo[];
    events?: {
        selectionChange?: string;
    };
}
