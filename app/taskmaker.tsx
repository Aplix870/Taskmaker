import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import ColorPicker, { Swatches } from 'reanimated-color-picker';
import { addTaskDb, updateTask } from './database';
import { styles } from './styles';

export default function TaskMaker() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 850;
  const panelMargin = isSmallScreen ? 25 : Math.min(width * 0.25, 600); // small screen have tiny margin, large screens → up to 600px
  const scale = isSmallScreen ? width / 700 : 1; // smaller text etc on mobile
  const buttonSize = isSmallScreen ? 50 : 80;
  const iconSize = buttonSize * 0.5;


     const router = useRouter();
     const params = useLocalSearchParams();
     const isEdit = params.id !== undefined && params.id !== null; // true if editing, false if creating (because paramaters were/were not passed)

     const [name, setName] = useState((params.name as string) || '');
     const [description, setDescription] = useState((params.description as string) || '');
     const [backColour, setBackColour] = useState((params.backColour as string) || '#ffffff');
     const [textColour, setTextColour] = useState((params.textColour as string) || '#000000');
     const [imageUri, setImageUri] = useState((params.imageUri as string) || undefined);
     const [alarm, setAlarm] = useState(params.dateTime ? new Date(params.dateTime as string) : undefined);
     const [taskId] = useState(params.id ? Number(params.id) : undefined);
     
     const [openDate, setOpenDate] = useState(false);
     const [openTime, setOpenTime] = useState(false);
     const [activePicker, setActivePicker] = useState<"text" | "background" | "alarm" | null>(null);
     const [modalVisible, setModalVisible] = useState(false);


const onSelectColor = ({ hex }: { hex: string }) => {
  'worklet';
  if (activePicker === 'background') {
    setBackColour(hex);
    
    // If previous colour is black/white then it wasn't manually set, so set to black/white based on background instead
    const isDark = isColorDark(hex);
    setTextColour((prev) => {
        if (prev === '#000' || prev === '#fff') {
         return isDark ? '#fff' : '#000';
        } else {
          // Preserve manual text color
          return prev;
        }
});
  } else if (activePicker === 'text') {
    setTextColour(hex);
  }
};

  const pickImage = async () => {
  // Ask for permission
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert('Permission to access camera roll is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};



const handleSubmit = async () => {
  if (!name.trim() || !description.trim()) {
    alert('Please fill out both fields');
    return;
  }
  try {
    if (taskId) {
      // Update existing task
      await updateTask(taskId, name, description, textColour, backColour, alarm, imageUri);
    } else {
      // Add new task
      await addTaskDb(name, description, textColour, backColour, alarm, imageUri);
    }
    alert('Task saved successfully!');
    router.push('/');
  } catch (err) {
    console.error('Error saving task', err);
    alert('Error saving task');
  }
};  

  function isColorDark(hex: string) {
  // convert hex to RGB
  const r = parseInt(hex.substr(1,2), 16);
  const g = parseInt(hex.substr(3,2), 16);
  const b = parseInt(hex.substr(5,2), 16);

  // formula for luminance
  const luminance = 0.299*r + 0.587*g + 0.114*b;
  return luminance < 128; // true if dark
}

  return (
    <View style={styles.container}>
         <View style={[styles.titleContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>

          {/*Title + Button to go back to tasks*/}
          <Text style={[styles.textTitle,{fontSize: 30 * scale}]}>Taskmaker</Text>
           <TouchableOpacity onPress={() => router.push('/')} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }}>
              <MaterialIcons
                name='format-list-bulleted'
                size={40}
                color="black"
                />
            </TouchableOpacity>

        </View>
      
         {/*Text showing user what page they're on. This changes depending on whether the user is creating/editing! */}
      <View style={[styles.centerBox, {marginHorizontal: panelMargin, marginVertical: 20}]}>
        <Text style={[styles.textName, {margin:10, alignItems:'center', fontSize: 30 * scale}]}>
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </Text>
        
  {/*If the user has actually set a due date, show that they've set one and allow them to cancel it*/}
       {alarm && (
  <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
    <Text style={{ fontSize: 25 * scale, color: 'red', flex: 1 }}>
      Alarm set for: {alarm.toLocaleDateString()} {alarm.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    <TouchableOpacity
      onPress={() => setAlarm(undefined)}
      style={{ padding: 5 }}
    >
      <FontAwesome5 name="trash" size={25 * scale} color={textColour} />
    </TouchableOpacity>
  </View>
)}

     {/*Title and description input boxes*/}
        <TextInput
                  placeholder="Title"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  clearButtonMode="always"
                  style={[styles.searchBox,{backgroundColor:backColour, color: textColour, fontSize: 25 * scale, height: '8%'}]}
                  autoCapitalize="sentences"
                  autoCorrect={true}
                />
        <View style={styles.contentRow}>
        <TextInput
                  placeholder=".   .   ."
                  placeholderTextColor="#888"
                  value={description}
                  onChangeText={setDescription}
                  clearButtonMode="always"
                  style={[styles.searchBox,{backgroundColor:backColour, color: textColour, fontSize: 25 * scale, height: '100%', flex:3, textAlignVertical: 'top'}]}
                  autoCapitalize="none"
                  autoCorrect={true}
                  multiline
                />


        </View>
        
   {/* Image Panel - always visible */}
<View style={styles.imagePanel}>
  <TouchableOpacity
    style={styles.imageTouchable}
    onPress={pickImage}
    activeOpacity={0.75}
  >
    {imageUri ? (
      <Image
        source={{ uri: imageUri }}
        style={styles.imageContent}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.emptyImage}>
         <FontAwesome5
            name='image'
            size={60 * scale}
            color={textColour}
          />
      </View>
    )}
  </TouchableOpacity>
</View>
      
        <View style={{flexDirection:'row'}}> 

 {/* Background color picker */}
<TouchableOpacity
  onPress={() => { setActivePicker('background'); setModalVisible(true); }}
  style={{
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: backColour,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
    borderColor: '#303030ff',
  }}
>
  <AntDesign
    name='carry-out'
    size={iconSize}
    color={textColour}
  />
</TouchableOpacity>

{/* Text color picker */}
<TouchableOpacity
  onPress={() => { setActivePicker('text'); setModalVisible(true); }}
  style={{
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: backColour,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
    borderColor: '#303030ff',
  }}
>
  <MaterialCommunityIcons
    name='format-letter-case'
    size={iconSize}
    color={textColour}
  />
</TouchableOpacity>

{/* Deadline/Alarm setter */}
<TouchableOpacity
  onPress={() => { setActivePicker('alarm'); setModalVisible(true); setOpenDate(true); }}
  style={{
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: backColour,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
    borderColor: '#303030ff',
  }}
>
  <FontAwesome5
    name='bell'
    size={iconSize}
    color={textColour}
  />
</TouchableOpacity>
      
{/* Shared Modal for Color Picker only */}
<Modal visible={modalVisible && (activePicker === 'background' || activePicker === 'text')}
       animationType="fade"
       transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
        Pick a {activePicker === 'background' ? 'Background' : 'Text'} Color
      </Text>
      <ColorPicker
        style={{ width: '100%', height: 200 }}
        value="white"
        onComplete={onSelectColor}
      >
        <Swatches/>
      </ColorPicker>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Date Picker (manages its own modal internally) */}
<DatePickerModal
  locale="en"
  mode="single"
  visible={openDate}
  date={alarm}
  onDismiss={() => {
    setOpenDate(false);
    setModalVisible(false);
  }}
  onConfirm={({ date }) => {
    setOpenDate(false);
    if (date) {
      const newDate = new Date(alarm ?? new Date());
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setAlarm(newDate);
    }
    setOpenTime(true);
  }}
/>

{/* Time Picker (manages its own modal internally) */}
<TimePickerModal
  visible={openTime}
  onDismiss={() => {
    setOpenTime(false);
    setModalVisible(false);
  }}
  onConfirm={({ hours, minutes }) => {
    setOpenTime(false);
    const newDate = new Date(alarm ?? new Date());
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setAlarm(newDate);
    setModalVisible(false);
  }}
  hours={alarm?.getHours() ?? 12}
  minutes={alarm?.getMinutes() ?? 0}
/>

{/*Submit button*/}
        <TouchableOpacity onPress={handleSubmit} style={[styles.smallButton,styles.center, {flex:10, margin:2}]}>
            <Text style={{ fontSize: 20 * scale, fontWeight: '600' }}>
              {isEdit ? 'Save Changes' : 'Create New Task'}
            </Text>
        </TouchableOpacity>
        </View>
      
    
      </View>

   


    </View>
  );
}
