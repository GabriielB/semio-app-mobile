import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import SemioSplashLogo from "@/assets/images/SemioSplashLogo.svg";
import SemioPet from "@/assets/images/SemioPet.svg";
import { useForm, Controller } from "react-hook-form";
import MailIcon from "@/assets/icons/MailIcon.svg";
import { useState } from "react";
import EyesIcon from "@/assets/icons/EyesIcon.svg";
import LockIcon from "@/assets/icons/LockIcon.svg";
import { useRouter } from "expo-router";
import UserIcon from "@/assets/icons/UserIcon.svg";
import { signUp } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin() {
    router.push("/(auth)/login");
  }

  const { control, handleSubmit } = useForm<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    setIsLoading(true);

    try {
      const user = await signUp(data.email, data.password, data.username);
      setUser(user);
      Alert.alert("Cadastro realizado", "Agora você pode fazer login!");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Erro no cadastro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-[#F4FAFF]">
        {/* cabeçalho */}
        <View className="w-full h-[200] flex-row justify-center items-center py-2">
          <SemioSplashLogo width={200} height={200} />
          <SemioPet />
        </View>
        {/*card azul */}
        <View className="flex-1 bg-[#3995FF] h-full rounded-t-[45px] items-center px-2 py-6">
          {/* Título + descrição */}
          <View className="w-full px-6 py-6 gap-1 my-4">
            <Text className="text-white text-3xl font-bold">Cadastro</Text>
            <Text className="text-white font-semibold">
              Junte-se à comunidade de estudantes de medicina e teste seus
              conhecimentos em semiologia. Cadastre-se agora para acessar
              quizzes, desafios e muito mais!
            </Text>
          </View>

          <View className="w-full px-6">
            {/* username */}
            <View className="w-full">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-white rounded-xl px-4 py-1 mb-4 w-full gap-1">
                    <UserIcon />
                    <TextInput
                      placeholder="Nome de usuário"
                      placeholderTextColor="#A3A3A3"
                      className="flex-1 text-base text-black"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
            </View>
            {/* email */}
            <View className="w-full">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-white rounded-xl px-4 py-1 mb-4 w-full gap-1">
                    <MailIcon />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#A3A3A3"
                      className="flex-1 text-base text-black"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
            </View>
            {/* senha */}
            <View className="w-full">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-white rounded-xl px-4 py-1 mb-4 w-full gap-1">
                    <LockIcon />

                    <TextInput
                      className="flex-1 text-base text-black"
                      placeholder="Senha"
                      placeholderTextColor="#A3A3A3"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                    {/*Toogle para alterar visibilidade */}
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Image
                          source={require("@/assets/icons/CloseEyesIcon.png")}
                          className="w-[25px] h-[25px] ml-2"
                          resizeMode="contain"
                        />
                      ) : (
                        <EyesIcon />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
            {/* confirmar senha */}
            <View className="w-full">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-white rounded-xl px-4 py-1 mb-4 w-full gap-1">
                    <LockIcon />
                    <TextInput
                      className="flex-1 text-base text-black"
                      placeholder="Confirmar senha"
                      placeholderTextColor="#A3A3A3"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                    {/*Toogle para alterar visibilidade */}
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Image
                          source={require("@/assets/icons/CloseEyesIcon.png")}
                          className="w-[25px] h-[25px] ml-2"
                          resizeMode="contain"
                        />
                      ) : (
                        <EyesIcon />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* botão entrar */}
            <View>
              <TouchableOpacity
                className={`py-3 rounded-3xl items-center ${
                  isLoading ? "bg-[#0040DD]/60" : "bg-[#0040DD]"
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-base">
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full max-w-[400px] items-center mt-6">
              {/* separador */}
              <View className="flex-row items-center w-full mb-4">
                <View className="flex-1 h-[1px] bg-white" />
                <Text className="text-white mx-2 text-sm">ou</Text>
                <View className="flex-1 h-[1px] bg-white" />
              </View>

              {/* botão google
              <TouchableOpacity className="flex-row items-center  justify-center rounded-xl px-4 py-3 w-full mb-4">
                <View className="bg-white w-10 h-10 rounded-full items-center justify-center mr-3 shadow-sm">
                  <Image
                    source={require("@/assets/icons/GoogleIcon.png")}
                    className="w-7 h-7"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-white text-base font-bold">
                  Cadastre com Google
                </Text>
              </TouchableOpacity> */}

              {/* Link de cadastro */}
              <View className="flex-row items-center justify-center gap-3">
                <Text className="text-white font-bold">Ja possui conta? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text className="text-white font-bold underline">Entre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
