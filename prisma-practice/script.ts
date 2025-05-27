import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function main() {

    // Get all ethnicity races
    // const ethnicityRace = await prisma.ethnicityRace.findMany();
    // console.log("Ethnicity Race:"); 
    // console.log(ethnicityRace);

    // Create a PermitToRegister record first
    // const permitToRegister = await prisma.permitToRegister.create({
    //     data: {
    //         id: "permit123",
    //         controlNumber: "1234567890",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         schoolYear: "2023-2024",
    //         campusId: "campus01",
    //         firstName: "John",
    //         lastName: "Doe",
    //         middleName: "M",
    //         studentDOB: new Date(2010, 0, 15),
    //         SSN: "123-45-6789",
    //         gender: "M",
    //         grade: "5",
    //         primaryPhone: "1234567890",
    //         typeOfPhone: "Mobile",
    //         bornOutsideUSA: "No",
    //         streetAddress1: "123 Main St",
    //         streetAddress2: "",
    //         city: "Amarillo",
    //         state: "TX",
    //         zip: "79101",
    //         parent1Relation: "Father",
    //         emergency1Relation: "Mother",
    //         emergency1PrimaryPhone: "9876543210",
    //         emergency1CellPhone: "9876543210",
    //         attendedAISD: "Yes",
    //         expulsion: "No",
    //         DAEP: "No",
    //         probation: "No",
    //         enrolledByName: "Jane Doe",
    //         enrolledByRelation: "Mother",
    //         enrolledByAddress: "123 Main St",
    //         enrolledByDOB: new Date(1980, 0, 1),
    //     }
    // });
    // console.log("Created PermitToRegister:", permitToRegister);

    //add a new food allergy
    // const newFoodAllergy = await prisma.foodAllergy.create({
    //     data: {
    //         id: "rmir09",
    //         permitControlNumber: "1234567890",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         parentWorkPhone: "1234567890",
    //         parentMobilePhone: "1234567890",
    //         parentHomePhone: "1234567890",
    //         hasFoodAllergies: true,
    //         date: new Date(),
    //         importedAt: new Date(),
    //         filed: true,
    //         filedAt: new Date(),
    //     },
    // });
    // console.log("New Food Allergy:");
    // console.log(newFoodAllergy);

    //search for last created food allergy
    const lastFoodAllergy = await prisma.foodAllergy.findFirst({
        orderBy: {
            createdAt: "desc",
        },
    });
    console.log("Last Food Allergy:");
    console.log(lastFoodAllergy);

    //update the food allergy with id 'rmir09' to food allergy 'false'
    const updatedFoodAllergy = await prisma.foodAllergy.update({
        where: { id: "rmir09" },
        data: {
            hasFoodAllergies: false,
        },
    });

    //show the updated food allergy
    console.log("Updated Food Allergy:");
    console.log(updatedFoodAllergy);
}

main()
.catch(e => {
    console.error(e);
})
.finally(async () => {
    await prisma.$disconnect();
});