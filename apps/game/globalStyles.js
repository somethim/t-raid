// styles/globalStyles.js

import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20
    },
    item: {
        fontSize: 18,
        marginVertical: 5
    }
});
