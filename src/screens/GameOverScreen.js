import React, { useEffect, useContext } from "react";
import { StyleSheet, View, Image, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { vh } from "react-native-expo-viewport-units";

import { GameContext } from "../context/GameContext";

import Card from "../components/Card";
import TitleText from "../components/TitleText";
import BodyText from "../components/BodyText";
import MainButton from "../components/MainButton";
import StageButton from "../components/StageButton";
import colors from "../constants/colors";
import {
  STAGE_SCORE,
  PLAY_AGAIN,
  NEXT_STAGE,
  GO_HOME,
} from "../constants/strings";

const GameOverScreen = ({ onPlayAgain, onGoHome, score }) => {
  const [{ stage, totalScore }, setGameInfo] = useContext(GameContext);

  const successStage = async () => {
    await AsyncStorage.setItem("STAGE", String(stage + 1));
    await AsyncStorage.setItem("TOTAL_SCORE", String(totalScore + score));
    setGameInfo((curState) => ({
      stage: curState.stage + 1,
      totalScore: curState.totalScore + score,
    }));
    onGoHome();
  };

  const replayStage = () => {
    onPlayAgain();
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go home?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: successStage },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.score}>
        <Card style={styles.card}>
          <TitleText>{STAGE_SCORE}</TitleText>
          <TitleText>{score}</TitleText>
        </Card>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/success.png")}
          style={styles.image}
          resizeMode={"cover"}
        />
      </View>
      <View style={styles.buttonContainer}>
        <StageButton onPress={replayStage}>{PLAY_AGAIN}</StageButton>
        <StageButton onPress={() => null}>{NEXT_STAGE}</StageButton>
      </View>
      <View style={styles.goHomeContainer}>
        <MainButton onPress={successStage}>{GO_HOME}</MainButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    width: "80%",
    marginVertical: vh(5),
  },
  card: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  imageContainer: {
    width: vh(30),
    height: vh(30),
    borderRadius: vh(30) / 2,
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    marginVertical: vh(5),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: vh(2),
    justifyContent: "space-around",
    alignItems: "center",
  },
  goHomeContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default GameOverScreen;
