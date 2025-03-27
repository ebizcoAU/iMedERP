const mysql = require('mysql2/promise');

// Function to build a hierarchical structure
async function buildHierarchy() {
    // Establish database connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'cableman',
        database: 'c1imed'
    });

    // Fetch data from the table
    const [rows] = await connection.execute(
        'SELECT accountID, parentID, accountName_en FROM account ORDER BY parentID, accountID'
    );

    // Close the connection
    await connection.end();

    // Create mappings for nodes and parent-child relationships
    const idToObject = {};
    const parentToChildren = {};

    // Initialize objects and map parents to children
    rows.forEach(row => {
        const obj = { accountID: row.accountID, accountName_en: row.accountName_en, children: [] };
        idToObject[row.accountID] = obj;
        if (!parentToChildren[row.parentID]) {
            parentToChildren[row.parentID] = [];
        }
        parentToChildren[row.parentID].push(obj);
    });

    // Recursive function to build the tree structure
    function buildTree(parentId) {
        const children = parentToChildren[parentId] || [];
        children.forEach(child => {
            child.children = buildTree(child.accountID);
        });
        return children;
    }

    // Construct the hierarchy starting from the root (null parent)
    return buildTree(0);
}

// Run the function and output the result
buildHierarchy()
    .then(hierarchy => {
        console.log(JSON.stringify(hierarchy, null, 4));
    })
    .catch(err => {
        console.error('Error:', err);
    });