
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "../context/ThemeProvider";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../model/user/user";
import { useEffect, useState } from "react";


const UserScreen = () => {
    const { theme } = usePreferences();

    const [user, setUser] = useState<IUser | undefined>(undefined)

    const getUser = async () => {
        const localUser = await AsyncStorage.getItem("user")
        if (localUser) {
            setUser(JSON.parse(localUser))
        }else {
            // nn sei oque colocar de erro
            return 
        }
    }

    useEffect(()=>{
        getUser()
    },[])

    return(
        <SafeAreaView
            style={[
                styles.container,
                {backgroundColor: theme.colors.background, gap:16}
            ]}>
            <Text theme={theme} style={[styles.title]}>
                Seu perfil
            </Text>
            <View>
                {user?.profile_image? 
                <Image
                    width={150}
                    height={150}
                    source={{uri: user?.profile_image}}
                    style={{borderRadius: 1000}}
                /> :
                <View style={{width:150,height:150,borderRadius:1000,backgroundColor: theme.colors.card}}></View>}
            </View>
            <View>
            <Text theme={theme}>
                Seu perfil
            </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    fontSize:16
  },
  button: {
    alignSelf: "stretch",
    borderRadius: 8,
    paddingVertical: 6,
  },
});


export default UserScreen;