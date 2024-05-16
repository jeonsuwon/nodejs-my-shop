import express from "express";
import Shop from "../schema/shop_schema.js";

const router = express.Router();

/* 상품 생성 */
router.post("/shop", async (req, res) => {
  const { goodsName, goodsInfor, manager, PW, status = "판매중" } = req.body;

  if (!goodsName) {
    return res
      .status(401)
      .json({ errorMessage: "데이터가 존재하지 않습니다." });
  }

  const goodsNumber = await makegoodsNumber(Shop);
  const creatDate = new Date();

  const shop = new Shop({
    goodsNumber,
    goodsName,
    goodsInfor,
    manager,
    PW,
    status,
    creatDate,
  });
  await shop.save();

  return res.status(201).json({ shop });
});

const makegoodsNumber = async function (Shop) {
  const shops = await Shop.find();
  if (!shops || shops.length === 0) {
    return 1;
  } else {
    const sortgoodsNumber = shops.sort((a, b) => a.goodsNumber - b.goodsNumber);
    for (let i = 0; i < sortgoodsNumber.length; i++) {
      if (sortgoodsNumber[i].goodsNumber !== i + 1) {
        return i + 1;
      }
    }
    // 모든 요소가 순차적인 경우, 가장 큰 goodsNumber보다 1 큰 값을 반환합니다.
    return sortgoodsNumber.length + 1;
  }
};

/* 상품 조회 */
router.get("/shop", async (req, res) => {
  const shops = await Shop.find().sort("-goodsNumber").exec();

  return res.status(200).json({ shops });
});

/* 상품 수정 */
router.patch("/shop/:shopId", async (req, res) => {
  const { shopId } = req.params;
  const { goodsName, goodsInfor, manager, PW, status = "판매중" } = req.body;

  const currentshop = await Shop.findById(shopId).exec();
  console.log(currentshop);
  if (!currentshop) {
    return res.status(404).json({ errorMessage: "존재하지않는 상품입니다." });
  }
  if (currentshop.PW == PW) {
    if (goodsName && goodsInfor && manager) {
      currentshop.goodsName = goodsName;
      currentshop.goodsInfor = goodsInfor;
      currentshop.manager = manager;
      currentshop.status = status;
      currentshop.chageDate = new Date();
      await currentshop.save();
      console.log(currentshop);
    } else {
      return res
        .status(404)
        .json({ errorMessage: "상품명, 정보, 담당자명을 입력해주세요." });
    }
  } else {
    return res.status(404).json({ errorMessage: "비밀번호를 확인해주세요." });
  }
  return res.status(200).json({ message: "성공적으로 완료되었습니다." });
});

/*상품 삭제 */
router.delete("/shop/:shopId", async (req, res) => {
  const { shopId } = req.params;

  const shop = await Shop.findById(shopId).exec();

  if (!shop) {
    return res.status(404).json({ errorMessage: "존재하지않는 상품입니다." });
  }

  await shop.deleteOne({ _id: shopId });

  return res.status(200).json({ message: "정상적으로 삭제되었습니다." });
});

export default router;
