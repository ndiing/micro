const Validation = require("../src/lib/validation.js");

{
    const validation = new Validation({
        user: { type: "string", required: true, minLength: 8, maxLength: 16 },
        pass: { type: "string", required: true, minLength: 8, maxLength: 16 },
        email: { type: "string", required: true, pattern: /^[\w.-]+@[\w-]+\.[\w.]{2,}$/ },
        age: { type: "number", required: true, min: 17, max: 60 },
        active: { type: "boolean", required: true },
        timestamp: { type: "date", required: true, defaultValue: () => new Date().toJSON() },
        other: {},
    });

    {
        const { errors, result } = validation.validate({
            user: "name",
            pass: "word",
            email: "ndiing.inc",
            age: 15,
            active: null,
            timestamp: null,
        });

        console.log(errors);

        console.log(result);
    }

    {
        const { errors, result } = validation.validate({
            user: "username",
            pass: "password",
            email: "ndiing.inc@gmail.com",
            age: 35,
            active: true,
            timestamp: null,
        });

        console.log(errors);
        console.log(result);
    }
}

{
    const validation = new Validation({
        username: { type: "string", required: true },
        profile: {
            type: "object",
            required: true,
            schema: {
                fullName: { type: "string", required: true },
                age: { type: "number", required: true, min: 18 },
                address: {
                    type: "object",
                    required: true,
                    schema: {
                        city: { type: "string", required: true },
                        zip: { type: "string", required: true, pattern: /^\d{5}$/ },
                    },
                },
            },
        },
    });

    {
        const { errors, result } = validation.validate({
            username: "ndiing",
            profile: {
                fullName: "Ridho",
                age: 17,
                address: {
                    city: "",
                    zip: "abcde",
                },
            },
        });

        console.log("Errors:", errors);
        console.log("Result:", result);
    }

    {
        const { errors, result } = validation.validate({
            username: "ndiing_pro",
            profile: {
                fullName: "Ridho Prasetya",
                age: 25,
                address: {
                    city: "Pacitan",
                    zip: "63511",
                },
            },
        });

        console.log("Errors:", errors);
        console.log("Result:", result);
    }
}

{
    const validation = new Validation({
        id: { type: "string", required: true },
        tanggal: { type: "date", required: true },
        keterangan: { type: "string", required: true },
        item_jurnal: {
            type: "array",
            required: true,
            items: {
                schema: {
                    id: { type: "string", required: true },
                    kode_jurnal: { type: "string", required: true },
                    kode_akun: { type: "string", required: true },
                    debit: { type: "number", required: true, min: 0 },
                    kredit: { type: "number", required: true, min: 0 },
                },
            },
        },
    });

    {
        const { errors, result } = validation.validate({
            id: "",
            tanggal: "invalid-date",
            keterangan: "",
            item_jurnal: [
                {
                    id: "",
                    kode_jurnal: "",
                    kode_akun: "",
                    debit: -100,
                    kredit: -200,
                },
                {
                    id: "2",
                    kode_jurnal: "J002",
                    kode_akun: "111-02",
                    debit: 1000,
                    kredit: 0,
                },
            ],
        });

        console.log("Errors:", errors);
        console.log("Result:", result);
    }

    {
        const { errors, result } = validation.validate({
            id: "JURNAL-001",
            tanggal: "2025-04-08T10:00:00Z",
            keterangan: "Transaksi penjualan",
            item_jurnal: [
                {
                    id: "1",
                    kode_jurnal: "J001",
                    kode_akun: "111-01",
                    debit: 500000,
                    kredit: 0,
                },
                {
                    id: "2",
                    kode_jurnal: "J001",
                    kode_akun: "411-01",
                    debit: 0,
                    kredit: 500000,
                },
            ],
        });

        console.log("Errors:", errors); // null
        console.log("Result:", result); // Sudah terkonversi & valid
    }
}
