const FONT_FAMILY = "Consolas, 微軟正黑體";

const UNIVERSITY_LIST = ["ncku", "ccu", "nsysu", "nchu"];
const UNIVERSITY_NAME = {ncku: "成功大學", ccu: "中正大學", nsysu: "中山大學" , nchu: "中興大學"};

const STATUS_LIST = ["coach", "captain", "manager", "leader", "member"];
const STATUS_HIGH_LIST = ["coach", "captain", "manager"];
const STATUS_NAME = {coach: "教練", captain: "領隊", manager: "管理", leader: "隊長", member: "隊員"};

const ATTR_LIST = ["name", "deptyear", "id", "birthday", "size", "lodging", "bus", "vegetarian"];
const ATTR_NCKU_FEW_LIST = ['name', 'deptyear', 'size'];
const ATTR_FEW_LIST = ['name'];
const ATTR_CHECK_LIST = ['lodging', 'bus', 'vegetarian'];
const ATTR_NAME = {name: "姓名", deptyear: "系級", id: "身分證字號", birthday: "出生年月日  (例: 1991-01-01)", size: "衣服尺寸",
                    lodging: "住宿", bus: "搭乘遊覽車", vegetarian: "素食", status: "身分", sport: "項目"};
const ATTR_TYPE = {name: "text", deptyear: "text", id: "text", birthday: "text",
                    size: "text", lodging: "checkbox", bus: "checkbox", vegetarian: "checkbox"}

export {
  FONT_FAMILY,

  UNIVERSITY_LIST,
  UNIVERSITY_NAME,
  STATUS_LIST,
  STATUS_HIGH_LIST,
  STATUS_NAME,
  ATTR_LIST,
  ATTR_NCKU_FEW_LIST,
  ATTR_FEW_LIST,
  ATTR_CHECK_LIST,
  ATTR_NAME,
  ATTR_TYPE
};
