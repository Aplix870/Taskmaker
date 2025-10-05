import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useFocusEffect, useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import filter from 'lodash/filter';

import { deleteTask, getTasks } from './database';
import { styles } from './styles';

interface Task {
  id: number;
  name: string;
  description: string;
  textColour: string;
  backColour: string;
  dateTime?: string | null; //optional
  imageUri?: string | null; //optional
}


export default function Index() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Task[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [fullData, setFullData] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Task | null>(null);
  const { width } = useWindowDimensions();

  //Scale down certain elements on smaller screens
  const isSmallScreen = width < 650;
  const scale = isSmallScreen ? width / 650 : 1; 
  const buttonSize = 50 * scale;

  //Navigation between pages
  const router = useRouter();

  //Load all of the user's locally stored tasks when the page loads
useFocusEffect(
  useCallback(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const tasks = await getTasks();
        setData(tasks);
        setFullData(tasks);
      } catch (err) {
        console.error('Error loading tasks', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [])
);


//Check if list contains input
 const contains = ({ name, description }: Task, query: string) => {
  return (
    name.toLowerCase().includes(query) ||
    description.toLowerCase().includes(query)
  );
};

//Takes the user's typed in string to search the list of tasks
 const handleSearch = (query: string) => {
  setSearchQuery(query);
  const formattedQuery = query.toLowerCase();
  const filteredData = filter(fullData, (task: Task) =>
    contains(task, formattedQuery)
  );
  setData(filteredData);
};

//Loading indicator + errors if no loading
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={"large"} color="#1144bbff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
          <Text style={[{fontFamily: "OswaldMedium", fontSize: 45 * scale}]}>Taskmaker</Text>
      </View>
    );
  }

  //Allows users to delete tasks + asks for platform appropriate confirmation message
  const confirmDelete = (taskName: string, onConfirm: () => void) => {
  if (Platform.OS === "web") {
    if (window.confirm(`Are you sure you want to delete "${taskName}"?`)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${taskName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onConfirm }
      ]
    );
  }
};

 return (
  <View style={styles.container}>

{/*The title + button going to taskmaker page*/}
 <View style={[styles.titleContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
  <Text style={[styles.textTitle,{fontFamily: "PacificoRegular", fontSize: 45 * scale}]}>Taskmaker</Text>
  <TouchableOpacity onPress={() => router.push('/taskmaker')} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }}>
      <MaterialIcons
      name='format-list-bulleted-add'
      size={40}
      color="black"
  />
  </TouchableOpacity>
</View>



    {/* Parent row: list (left) + details (right) */}
    <SafeAreaView style={[styles.contentRow, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>
      
      {/* LEFT SIDE - search + list */}
      <View style={styles.listContainer}>
        <TextInput
          placeholder="Search"
          clearButtonMode="always"
          style={styles.searchBox}
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
             const isPastDeadline = item.dateTime ? new Date(item.dateTime) < new Date() : false;
             //If the user actually set a date then check if that date came before right now (meaning the deadline is passed)

             return (
                  <TouchableOpacity
                    style={[
                      styles.itemContainer,
                      { backgroundColor: item.backColour },
                      // Red border for past deadline takes priority
                      isPastDeadline
                        ? { borderWidth: 2, borderColor: 'red' }
                        : selectedItem?.id === item.id
                        ? { borderWidth: 2, borderColor: 'black' }
                        : {}, // no border otherwise
                    //If past deadline, then red, otherwise if item selected, then black, otherwise nothing

                    ]}
                    onPress={() =>
                      setSelectedItem((prev) => (prev?.id === item.id ? null : item))
                      //When tapping a task, it becomes selected. If the item was already selected then unselect it
                    }
                  >
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.image} />
                    ) : (
                      <View style={[styles.image, { backgroundColor: "#ccc" }]} />
                      //If you have an image, show it
                    )}

                    <View style={{ flex: 1, margin: 5, maxHeight: 80 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[styles.textName, { fontFamily: "SpaceMonoRegular",color: item.textColour, flexShrink: 1 }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.dateTime && (
                          <Text style={{ fontFamily: "SpaceMonoRegular", color: isPastDeadline ? 'red' : item.textColour }} numberOfLines={1}>
                            Due: {new Date(item.dateTime).toLocaleString()}
                          </Text>
                          //Red text if past deadline
                        )}
                      </View>

                      <Text style={[styles.textEmail, { fontFamily: "SUSERegular", color: item.textColour }]} numberOfLines={2} ellipsizeMode="tail">
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
             )}}
         />

      </View>

{/* RIGHT SIDE - details panel */}
{selectedItem && (
  <View style={[styles.detailsPanel, { backgroundColor: selectedItem.backColour }]}>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>


<View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
  {/* Left spacer / close button */}
  <TouchableOpacity
    onPress={() => setSelectedItem(null)}
    style={{ width: 25, alignItems: 'center' }} // fixed width spacer
  >
    <AntDesign name="close" size={40 * scale} color={selectedItem.textColour} />
  </TouchableOpacity>

  {/* Center: title + due date */}
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text
      style={[styles.textTitle, {fontFamily: "SpaceMonoRegular", color: selectedItem.textColour, fontSize: 50 * scale, textAlign: 'center' }]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.2}
    >
      {selectedItem.name}
    </Text>
    {selectedItem.dateTime && (
      <Text style={[styles.textContents, {fontFamily: "SpaceMonoRegular", color: selectedItem.textColour, fontSize: 30 * scale, margin: 20 * scale }]}>
        Due: {new Date(selectedItem.dateTime).toLocaleString()}
      </Text>
    )}
  </View>

  {/* Right buttons (edit + delete) */}
  
  <View style={{ width: 60, flexDirection: 'row', justifyContent: 'flex-end' }}>

    {/*Edit Button*/}
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/taskmaker',
        params: {
          id: selectedItem.id.toString(),
          name: selectedItem.name,
          description: selectedItem.description,
          textColour: selectedItem.textColour,
          backColour: selectedItem.backColour,
          imageUri: selectedItem.imageUri ?? '',
          dateTime: selectedItem.dateTime ?? '',
        },
      })}
      style={{ marginRight: 15, marginLeft:5 }}
    >
      <FontAwesome5 name="edit" size={40 * scale} color={selectedItem.textColour} />
    </TouchableOpacity>

    {/*Delete Button*/}
    <TouchableOpacity
      onPress={() => {
        confirmDelete(selectedItem.name, async () => {
          await deleteTask(selectedItem.id);
          setData(prev => prev.filter(task => task.id !== selectedItem.id));
          setFullData(prev => prev.filter(task => task.id !== selectedItem.id));
          setSelectedItem(null);
        });
      }}
    >
      <FontAwesome5 name="trash" size={40 * scale} color={selectedItem.textColour} />
    </TouchableOpacity>
  </View>
</View>

      <View style={styles.detailsContent}>
        <Text style={[styles.textContents, {fontFamily: "SUSERegular",color: selectedItem.textColour, fontSize: 30 * scale, margin: 20 * scale }]}>
          {selectedItem.description}
        </Text>

{/* If an image for this task exists, show it. These values may be tweaked etc */}
        {selectedItem.imageUri && (
          <Image
            source={{ uri: selectedItem.imageUri }}
            style={{
              width: '100%',
              height: undefined,
              minWidth: 450 * scale,
              minHeight: 450 * scale,
              maxWidth: '95%',
              maxHeight: 1000 * scale,
              alignSelf: 'center',
              resizeMode: 'contain',
              borderColor: selectedItem.textColour,
              borderWidth: 2,
              borderRadius: 8,
              marginVertical: 20 * scale
            }}
          />
        )}
      </View>
    </ScrollView>
  </View>
)}

    </SafeAreaView>
  </View>
);
}
