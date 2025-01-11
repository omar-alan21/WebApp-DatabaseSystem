function buildQuery(query, params) {

    const sqlBuilderString = (key, type, filter) => {
        switch (type) {
            case 'contains': return `${key} LIKE '%${filter}%'`;
            case 'notContains': return `${key} NOT LIKE '%${filter}%'`;
            case 'equals': return `${key} = '${filter}'`;
            case 'notEqual': return `${key} != '${filter}'`;
            case 'startsWith': return `${key} LIKE '${filter}%'`;
            case 'endsWith': return `${key} LIKE '%${filter}'`;
            case 'blank': return `${key} = ''`;
            case 'notBlank': return `${key} != ''`;
            default: return '';
        }
    };

    const sqlBuilderNumber = (key, value, filter, filterTo) => {
        switch (value) {
            case 'equals': return `${key} = ${filter}`;
            case 'notEqual': return `${key} != ${filter}`;
            case 'greaterThan': return `${key} > ${filter}`;
            case 'greaterThanOrEqual': return `${key} >= ${filter}`;
            case 'lessThan': return `${key} < ${filter}`;
            case 'lessThanOrEqual': return `${key} <= ${filter}`;
            case 'inRange': return `${key} BETWEEN ${filter} AND ${filterTo}`;
            case 'blank': return `${key} = ''`;
            case 'notBlank': return `${key} != ''`;
            default: return '';
        }
    };

    const sqlBuilderDate = (key, value, filter, filterTo) => {
        switch (value) {
            case 'equals': return `${key} = '${filter}'`;
            case 'notEqual': return `${key} != '${filter}'`;
            case 'greaterThan': return `${key} > '${filter}'`;
            case 'lessThan': return `${key} < '${filter}'`;
            case 'inRange': return `${key} BETWEEN '${filter}' AND '${filterTo}'`;
            case 'blank': return `${key} = ''`;
            case 'notBlank': return `${key} != ''`;
            default: return '';
        }
    };

    const sqlBuilder = (key, filterModel) => {
        if (filterModel.filterType === 'text') {
            return sqlBuilderString(key, filterModel.type, filterModel.filter)
        }
        else if (filterModel.filterType === 'number') {
            return sqlBuilderNumber(key, filterModel.type, filterModel.filter, filterModel.filterTo)
        }
        else if (filterModel.filterType === 'date') {
            return sqlBuilderDate(key, filterModel.type, filterModel.dateFrom.split(' ')[0], filterModel.dateTo && filterModel.dateTo.split(' ')[0])
        }
    }

    // INIT
    const startRow = parseInt(params.startRow, 10) || null;
    const endRow = parseInt(params.endRow, 10) || null;
    const filterModel = params.filterModel && JSON.parse(params.filterModel) || {};
    const sortModel = params.sortModel && JSON.parse(params.sortModel) || {};

    let Filters = '';
    let Sort = '';
    let Limit = '';

    // FILTERS
    if (Object.keys(filterModel).length > 0) {

        Filters += query.includes('HAVING') ? 'AND '  : 'HAVING ';
        
        Object.keys(filterModel).forEach((key, index) => {
            if (index > 0) Filters += ' AND ';

            const result = [];

            Filters += '(';
            if (filterModel[key].operator) {
                const cond1 = sqlBuilder(key, filterModel[key].conditions[0])
                const cond2 = sqlBuilder(key, filterModel[key].conditions[1])
                Filters += `${cond1} ${filterModel[key].operator} ${cond2}`
            }
            else
                Filters += sqlBuilder(key, filterModel[key]);
            
            Filters += ')';
        });
    }

    // SORT
    if (sortModel.length > 0) {
        const conditions = [];
        Sort += 'ORDER BY ';
        sortModel.forEach(item => {
            conditions.push(`${item.colId} ${item.sort.toUpperCase()}`);
        });
        Sort += conditions.join(', ');
    }

    // LIMIT
    if (startRow !== null && endRow !== null)
    Limit = `LIMIT ${startRow}, ${endRow - startRow}`;

    const FullFinalQuery = `${query} ${Filters} ${Sort}`;
    const finalQuery = `${query} ${Filters} ${Sort} ${Limit}`;
    return {FullFinalQuery, finalQuery};
}

module.exports = buildQuery