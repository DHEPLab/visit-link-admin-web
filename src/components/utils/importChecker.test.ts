import i18n from "@/i18n";
import { checkBabies } from "./importChecker";
import Chance from "chance";
import dayjs from "dayjs";

const chance = new Chance();
const EDCDate = dayjs().add(10, "days").format("YYYY-MM-DD");
const BirthDate = dayjs().subtract(100, "days").format("YYYY-MM-DD");

const ValidEDCBabyItem = {
  "Baby ID": "1",
  "Growth Stage": "Unborn",
  "Baby Name": chance.name(),
  Gender: "Male",
  "Due Date": EDCDate,
  "Birth Day": "",
  "Infant Supplementary Food": "Yes",
  "Feeding Methods": "",
  Area: "US/Arizona/Litchfield Park",
  "Detailed Address": "123 Street",
  Comments: "",
  "CHW ID": "CHW001",
  Caregiver_Main_name: chance.name(),
  Caregiver_Main_relationship: "Paternal Grandfather",
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

const ValidEDCChineseBabyItem = {
  宝宝ID: "1",
  成长阶段: "Unborn",
  宝宝姓名: chance.name(),
  宝宝性别: "Male",
  预产期: EDCDate,
  出生日期: "",
  辅食: "",
  喂养方式: "",
  所在区域: "四川省/成都市/高新区/桂溪街道",
  详细地址: "123 Street",
  备注信息: "",
  社区工作者ID: "CHW001",
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
  "Growth Stage": "Born",
  "Baby Name": chance.name(),
  Gender: "Female",
  "Due Date": "",
  "Birth Day": BirthDate,
  "Infant Supplementary Food": "Add",
  "Feeding Methods": "Exclusive Breastfeeding",
  Area: "US/Arizona/Litchfield Park",
  "Detailed Address": "123 Street",
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
  afterEach(() => {
    i18n.changeLanguage("en");
  });

  it("should passing the validation when baby and caregiver name Chinese name length between 1 to 50", () => {
    i18n.changeLanguage("zh");
    const babies = [
      {
        ...ValidEDCChineseBabyItem,
        宝宝姓名: "名".repeat(50),
        Caregiver_Main_name: "字".repeat(50),
        Caregiver_Main_phone: "13800138000138000",
      },
    ];

    const { errors } = checkBabies(babies);

    expect(errors.length).toBe(0);
  });

  it("should validate babies correctly", () => {
    const babies = [ValidEDCBabyItem, ValidBirthBabyItem];

    const { validBabies, errors } = checkBabies(babies);

    expect(errors.length).toBe(0);
    expect(validBabies.length).toBe(2);
    expect(validBabies[0].identity).toBe("1");
    expect(validBabies[0].gender).toBe("MALE");
    expect(validBabies[0].stage).toBe("UNBORN");
    expect(validBabies[0].edc).toBe(EDCDate);

    expect(validBabies[1].identity).toBe("2");
    expect(validBabies[1].gender).toBe("FEMALE");
    expect(validBabies[1].stage).toBe("BORN");
    expect(validBabies[1].birthday).toBe(BirthDate);
    // TODO: need check this logic
    // expect(validBabies[0].assistedFood).toBeTruthy();
    expect(validBabies[1].feedingPattern).toBe("EXCLUSIVE_BREASTFEEDING");
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
