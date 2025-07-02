import { Pool } from "pg";

// Again, this should be read from an environment variable
module.exports = new Pool({
    connectionString: ""
});
