import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  percentage: number;
  correct: number;
  total: number;
  bonus: number;
  score: number;
}

export default function CircleProgress({
  percentage,
  correct,
  total,
  bonus,
  score,
}: Props) {
  const size = 180; //
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ alignItems: "center", marginBottom: 24 }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#E0E0E0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#0040DD"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 28, fontWeight: "bold", color: "#1E1E1E" }}
            >
              {percentage}%
            </Text>
            <Text style={{ fontSize: 15, color: "#1E1E1E" }}>
              {correct} / {total}
            </Text>
            <Text style={{ fontSize: 15, color: "#1E1E1E" }}>Questões</Text>
          </View>
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-lg font-bold text-[#1E1E1E]">
          {" "}
          + {bonus || 0} pts (bônus por tempo)
        </Text>
      </View>
      <View className="mt-4">
        <Text className="text-lg font-bold text-[#1E1E1E]">
          Total: {score || 0} pts
        </Text>
      </View>
      <View className="mt-4">
        <Text className="text-lg font-bold text-[#1E1E1E]">Bom trabalho!</Text>
      </View>
    </View>
  );
}
