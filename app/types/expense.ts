export default interface Expense {
    key: number | undefined;
    item: string;
    vendor: string;
    spent: number;
    normal: boolean | undefined;
};