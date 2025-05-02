import {StyleSheet, Text} from 'react-native';
import {View} from "@zennui/native/slot";
import {Link} from "expo-router";
import {Button} from "@zennui/native";
import {SHORTCUTS} from "@/lib/constants";

const style = StyleSheet.create({
    view: {
        borderRadius : 15,
        padding: 20,
        width: '100%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    link: {
        color : '#FFC107',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    svg: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    text: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    }
});


export const NavigationBar = () => {
    return (
        <>
            {SHORTCUTS.map((item, index) => (
                <View key={index} style={style.view}>
                    <Link href={item.href}>
                        <item.Svg style={style.svg}/>
                        <Button style={style.button}>
                            <Text style={style.text}>{item.name}</Text>
                        </Button>
                    </Link>
                </View>
            ))}
        </>
    )
}