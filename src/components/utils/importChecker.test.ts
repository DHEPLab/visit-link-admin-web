import { checkBabies } from "./importChecker";
import Chance from "chance";
import dayjs from "dayjs";

const chance = new Chance();
const EDCDate = dayjs().add(10, "days").format("YYYY-MM-DD");
const BirthDate = dayjs().subtract(100, "days").format("YYYY-MM-DD");

const ValidEDCBabyItem = {
  "Baby ID": "1",
  "Growth Stage": "EDC",
  "Baby Name": chance.name(),
  Gender: "Male",
  "Due Date": EDCDate,
  "Birth Day": "",
  "Infant Supplementary Food": "",
  "Feeding Methods": "",
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

const ValidBirthBabyItem = {
  "Baby ID": "2",
  "Growth Stage": "Birth",
  "Baby Name": chance.name(),
  Gender: "Female",
  "Due Date": "",
  "Birth Day": BirthDate,
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
    const babies = [ValidEDCBabyItem, ValidBirthBabyItem];

    const { validBabies, errors } = checkBabies(babies);

    expect(errors.length).toBe(0);
    expect(validBabies.length).toBe(2);
    expect(validBabies[0].identity).toBe("1");
    expect(validBabies[0].gender).toBe("MALE");
    expect(validBabies[0].stage).toBe("EDC");
    expect(validBabies[0].edc).toBe(EDCDate);

    expect(validBabies[1].identity).toBe("2");
    expect(validBabies[1].gender).toBe("FEMALE");
    expect(validBabies[1].stage).toBe("BIRTH");
    expect(validBabies[1].birthday).toBe(BirthDate);
    // TODO: need check this logic
    // expect(validBabies[0].assistedFood).toBeTruthy();
    expect(validBabies[1].feedingPattern).toBe("BREAST_MILK");
  });

  it("should return an error for duplicate Baby ID", () => {
    const babies = [ValidEDCBabyItem, ValidEDCBabyItem];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Duplicate ID");
  });

  it("should return an error for missing Baby Name", () => {
    const babies = [{ ...ValidEDCBabyItem, "Baby Name": "" }];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Baby name is empty");
  });

  it("should return an error for invalid stage", () => {
    const babies = [{ ...ValidEDCBabyItem, "Growth Stage": "XXX" }];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(1);
    expect(errors[0].matters).toBe("Baby growth stage is empty or wrong format");
  });
});
