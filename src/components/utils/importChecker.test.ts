import { checkBabies } from "./importChecker";
import Chance from "chance";

const chance = new Chance();
const ValidBabyItem = {
  "Baby ID": "1",
  "Growth Stage": "EDC",
  "Baby Name": chance.name(),
  Gender: "Male",
  "Due Date": "2024-12-25",
  "Birth Day": "",
  "Infant Supplementary Food": "Add",
  "Feeding Methods": "Breast Milk",
  Area: "US/Arizona/Litchfield Park",
  Address: "123 Street",
  Comments: "",
  "CHW ID": "CHW001",
  Caregiver_Main_name: chance.name(),
  Caregiver_Main_relationship: "Mother",
  Caregiver_Main_phone: "13800138000",
  Caregiver_Main_Wechat: "wechat001",
  Caregiver_II_name: chance.name(),
  Caregiver_II_relationship: "Father",
  Caregiver_II_phone: "13800138001",
  Caregiver_II_Wechat: "wechat002",
  Caregiver_III_name: "",
  Caregiver_III_relationship: "",
  Caregiver_III_phone: "",
  Caregiver_III_Wechat: "",
  Caregiver_IV_name: "",
  Caregiver_IV_relationship: "",
  Caregiver_IV_phone: "",
  Caregiver_IV_Wechat: "",
};

describe("checkBabies", () => {
  it("should validate babies correctly", () => {
    const babies = [ValidBabyItem];

    const { validBabies, errors } = checkBabies(babies);

    expect(errors.length).toBe(0);
    expect(validBabies.length).toBe(1);
    expect(validBabies[0].identity).toBe("1");
    expect(validBabies[0].gender).toBe("MALE");
    expect(validBabies[0].stage).toBe("EDC");
    // TODO: need check this logic
    // expect(validBabies[0].assistedFood).toBeTruthy();
    expect(validBabies[0].feedingPattern).toBe("BREAST_MILK");
  });

  it("should return an error for duplicate Baby ID", () => {
    const babies = [ValidBabyItem, ValidBabyItem];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Duplicate ID");
  });

  it("should return an error for missing Baby Name", () => {
    const babies = [{ ...ValidBabyItem, "Baby Name": "" }];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Baby name is empty");
  });

  it("should return an error for invalid stage", () => {
    const babies = [{ ...ValidBabyItem, "Growth Stage": "XXX" }];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Baby growth stage is empty or wrong format");
  });
});
