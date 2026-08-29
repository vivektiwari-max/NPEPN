const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const pool = require("../database/db");

const filePath = path.join(__dirname, "..", "data", "colleges.csv");

async function importColleges() {

    const colleges = [];

    console.log("Reading CSV from:");
    console.log(filePath);

    fs.createReadStream(filePath)
        .pipe(csv({
    mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim()
}))
        .on("data", (row) => {

    const sourceId = parseInt(row.id, 10);

    if (!Number.isInteger(sourceId)) {
        return;
    }

    if (!row.name || !row.state) {
        return;
    }

    colleges.push(row);

})
        .on("end", async () => {

            console.log(`CSV rows found: ${colleges.length}`);

            if (colleges.length === 0) {
                console.log("No rows found in CSV.");
                process.exit(1);
            }

            try {

                for (const row of colleges) {

                    await pool.query(
                        `
                        INSERT INTO colleges
                        (
                            source_id,
                            college_name,
                            state,
                            district,
                            city,
                            address_line1,
                            address_line2,
                            pin_code
                        )
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                        ON CONFLICT DO NOTHING
                        `,
                        [
                            parseInt(row.id, 10),
                            row.name?.trim() || null,
                            row.state?.trim() || null,
                            row.district?.trim() || null,
                            row.city?.trim() || null,
                            row.address_line1?.trim() || null,
                            row.address_line2?.trim() || null,
                            row.pin_code?.trim() || null
                        ]
                    );
                }

                console.log("College data imported successfully!");

            } catch (error) {

                console.error("Import failed:", error.message);

            } finally {

                await pool.end();

            }
        })
        .on("error", (error) => {

            console.error("CSV reading error:", error.message);

        });
}

importColleges();