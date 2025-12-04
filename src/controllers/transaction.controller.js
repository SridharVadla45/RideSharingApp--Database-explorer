import prisma from '../config/prisma.js';

export const TransactionController = {
    registerDriverWithVehicle: async (req, res) => {
        const { driver, vehicle } = req.body;
        // Expecting { driver: { name, email, phone }, vehicle: { type, model, licensePlate } }

        if (!driver || !vehicle) {
            return res.status(400).json({ error: 'Missing driver or vehicle data' });
        }

        try {
            // Check if email or license plate already exists to provide better error
            const existingDriver = await prisma.driver.findUnique({ where: { email: driver.email } });
            if (existingDriver) {
                return res.status(400).json({ error: `Driver with email ${driver.email} already exists` });
            }

            const existingVehicle = await prisma.vehicle.findUnique({ where: { license_plate_no: vehicle.licensePlate } });
            if (existingVehicle) {
                return res.status(400).json({ error: `Vehicle with license plate ${vehicle.licensePlate} already exists` });
            }

            const result = await prisma.$transaction(async (prisma) => {
                // 1. Create Driver
                const newDriver = await prisma.driver.create({
                    data: {
                        name: driver.name,
                        email: driver.email,
                        phone_number: driver.phone
                    }
                });

                // 2. Create Vehicle
                const newVehicle = await prisma.vehicle.create({
                    data: {
                        type: vehicle.type,
                        model: vehicle.model,
                        license_plate_no: vehicle.licensePlate
                    }
                });

                // 3. Link them
                const link = await prisma.driver_vehicle.create({
                    data: {
                        driver_id: newDriver.driver_id,
                        vehicle_id: newVehicle.vehicle_id
                    }
                });

                return { driver: newDriver, vehicle: newVehicle, link };
            });

            res.status(201).json({
                message: 'Driver and Vehicle registered successfully',
                data: result
            });

        } catch (error) {
            console.error("Error in registerDriverWithVehicle:", error);
            res.status(500).json({ error: 'Transaction failed: ' + error.message });
        }
    }
};
