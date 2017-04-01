const fontFamily = "Consolas, 微軟正黑體";

const universityList = ["ncku", "ccu", "nsysu", "nchu"];
const universityName = {ncku: "成功大學", ccu: "中正大學", nsysu: "中山大學" , nchu: "中興大學"};

const statusList = ["coach", "captain", "manager", "leader", "member"];
const highStatusList = ["coach", "captain", "manager", "leader"];
const statusName = {coach: "教練", captain: "領隊", manager: "管理", leader: "隊長", member: "隊員"};

const attrList = ["name", "deptyear", "id", "birthday", "size", "lodging", "bus", "vegetarian"];
const attrName = {name: "姓名", deptyear: "系級", id: "身分證字號", birthday: "出生年月日", size: "衣服尺寸",
                    lodging: "住宿", bus: "搭乘遊覽車", vegetarian: "素食", status: "身分"};
const attrType = {name: "text", deptyear: "text", id: "text", birthday: "date",
                    size: "text", lodging: "checkbox", bus: "checkbox", vegetarian: "checkbox"}

export {
  fontFamily,

  universityList,
  universityName,
  statusList,
  highStatusList,
  statusName,
  attrList,
  attrName,
  attrType
};
