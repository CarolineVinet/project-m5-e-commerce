import React from "react";
import styled from "styled-components";
import BuyButton from "./BuyButton";
import BackLink from "./BackLink";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartObj } from "../reducers/cart-reducer";
import Header from "./Header";
import Spinner from "./Spinner";
import ErrorPage from "./ErrorPage";
import {
  requestCurrItem,
  receiveCurrItem,
  receiveCurrItemError,
} from "../actions";
import {
  getcurrentItem,
  getCurrentItemStatus,
} from "../reducers/currItem-reducer";

// displays single item page
const ItemPage = () => {
  const dispatch = useDispatch();
  const currItem = useSelector(getcurrentItem);
  const status = useSelector(getCurrentItemStatus);

  const { itemId } = useParams();

  const cartObj = useSelector(getCartObj);

  React.useEffect(() => {
    dispatch(requestCurrItem());
    fetch(`/items/${itemId}`)
      .then((res) =>
        res.json().then((data) => {
          return dispatch(receiveCurrItem(data));
        })
      )
      .catch((err) => dispatch(receiveCurrItemError()));
  }, [dispatch, itemId]);

  return (
    <>
      <Header />

      {currItem && status === "idle" && (
        <MegaWrapper>
          <Wrapper>
            <ItemName>{currItem.name}</ItemName>
          </Wrapper>
          <ItemProfile>
            <ImageDiv>
              <ItemPicture src={currItem.imageSrc}></ItemPicture>
            </ImageDiv>

            <DescriptionDiv>
              <DescriptionHeader>Item Description</DescriptionHeader>
              <ItemCategory>Category: {currItem.category}</ItemCategory>
              <BodyLocation>
                This item is designed to be worn on your{" "}
                {currItem.body_location.toLowerCase()}.
              </BodyLocation>
              <ItemStock>
                {cartObj[itemId]
                  ? currItem.numInStock - cartObj[itemId].quantity
                  : currItem.numInStock}
                &nbsp;in stock
              </ItemStock>
              <ItemPrice>{currItem.price}</ItemPrice>
              <ButtonDiv>
                <BuyButton
                  numItemInStock={
                    cartObj[itemId]
                      ? currItem.numInStock - cartObj[itemId].quantity
                      : currItem.numInStock
                  }
                  item={currItem}
                ></BuyButton>
              </ButtonDiv>
            </DescriptionDiv>
          </ItemProfile>
          <BackLink> return to Gallery </BackLink>
        </MegaWrapper>
      )}
      {status === "loading" && <Spinner />}
      {status === "error" && <ErrorPage />}
    </>
  );
};

const MegaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const ItemProfile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 20px;
  border: #8080809c 1px solid;
  padding: 15px;
  border-radius: 20px;
`;

const ImageDiv = styled.div`
  height: 350px;
  width: 350px;
  margin: 15px;
`;

const ItemPicture = styled.img`
  height: 350px;
  width: 350px;
`;

const DescriptionDiv = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  line-height: 2.5;
  margin: 15px;
  padding: 15px;
  border: #8080809c 1px solid;
  border-radius: 5px;
  box-shadow: 1px 1px 5px grey;
`;

const ItemName = styled.div`
  font-size: 32px;
  margin-top: 20px;
  font-weight: bold;
  color: #080808ba;
`;

const DescriptionHeader = styled.div`
  font-size: 28px;
  align-self: center;
  color: #201f1f99;
  margin-top: -10px;
  border-bottom: 1px grey solid;
`;

const ItemCategory = styled.div`
  font-size: 20px;
  margin-top: 20px;
`;

const BodyLocation = styled.div`
  font-size: 20px;
  margin-bottom: 40px;
`;

const ItemStock = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  border-top: 1px grey solid;
  font-size: 16px;
  color: grey;
`;

const ItemPrice = styled.div`
  font-size: 32px;
  font-weight: bold;
  align-self: center;
  margin-top: -30px;
  color: #000000ad;
`;

const ButtonDiv = styled.div`
  align-self: center;
`;

export default ItemPage;
