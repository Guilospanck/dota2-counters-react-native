import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Heroes from './heroes';
import { parseInfoFromServer, getData } from './counters';
import FlatListBasics from './flatlistbasic';

const Welcomescreen = () => {

    const [heroes, setHeroes] = useState(Heroes);  // For the main data
    const [filteredHeroes, setFilteredHeroes] = useState([]); // Filtered data
    const [selectedHero, setSelectedHero] = useState(""); // selected data
    const [selectedID, setSelectedID] = useState(null); // to pass to the results screen
    const [selectedData, setSelectedData] = useState(null); // to pass to the results screen
    const [counterHeroes, setCounterHeroes] = useState([]); // counter heroes

    useEffect(() => {
        parseInfoFromServer().then((res) => {
            getData().then((resp) => {
                setCounterHeroes(JSON.parse(resp));
            });
        });
    }, []);

    const findHero = (query) => {
        //method called everytime when we change the value of the input
        if (query) {
            //making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            //setting the filtered hero array according the query
            let heroesToFilter = heroes.filter((hero) => hero.hero.search(regex) >= 0);
            setFilteredHeroes(
                heroesToFilter
            );
        } else {
            //if the query is null then return blank
            setFilteredHeroes([]);
        }
    };

    const getCountersByID = () => {
        let counters = counterHeroes[selectedID];
        let response = [];
        for (let i = 0; i < counters.length; i++) {
            response.push({
                key: counters[i]
            });
        }
        setSelectedData(response)
    };

    return (
        <View>
            <View style={styles.titleContainer}>
                <Text style={styles.inputTitle}> Qual hero quer counterar?</Text>
            </View>
            <View style={styles.autocompleteContainer}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    //data to show in suggestion
                    data={filteredHeroes}
                    //default value if you want to set something in input
                    defaultValue={
                        JSON.stringify(selectedHero) === "" ?
                            '' :
                            selectedHero.toUpperCase()
                    }
                    // onchange of the text changing the state of the query
                    // which will trigger the findHero method
                    // to show the suggestions
                    onChangeText={(text) => findHero(text)}
                    placeholder="Qual hero deseja counterar?"
                    renderItem={({ item }) => (
                        //you can change the view you want to show in suggestions
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedHero(item.hero);
                                setFilteredHeroes([]);
                                setSelectedID(item.id);
                            }}>
                            <Text style={styles.itemText}>
                                {item.hero.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => getCountersByID()}
                    style={styles.button}>
                    <Text style={styles.text}>
                        Ver Counters
                </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.flatlistContainer}>
                {selectedData != null ?
                    <FlatListBasics data={selectedData} style={styles.flatlistStyle} />
                    :
                    <></>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        marginBottom: 8
    },
    inputTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: "grey",
    },
    autocompleteContainer: {
        height: 30
    },
    buttonContainer: {
        marginTop: 65,
    },
    button: {
        backgroundColor: "black",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "white",
        paddingTop: 10,
        paddingBottom: 10
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18
    },
    flatlistContainer: {
        marginTop: 30,
        flex: 1,
        flexDirection: "column",
    },
    flatlistContainer: {
        height: "100%",
    }
})

export default Welcomescreen;