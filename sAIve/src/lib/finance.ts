/**
 * parameters:
 * current: The current period's value (number)
 * previous: The previous period's value (number | undefined | null)
 * 
 * Returns a formatted string representing the percentage change, e.g., "12.50% from last month"
 * or "No Change" if previous is missing/zero (handling division by zero is implied by logic check).
 * Actually, let's make it robust.
 */

export const calculatePercentageChange = (current: number, previous: number | null | undefined): string => {
    if (previous === null || previous === undefined || previous === 0) {
        return "No Change";
    }
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(2)}% from last month`;
};
