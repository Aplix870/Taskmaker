// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container and layout
  container: {
    flex: 1,
    backgroundColor: '#ebd887', // main yellow background
  },
  center: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },

  // Title / text
  titleContainer: {
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  textTitle: {
    fontSize: 50,
    marginLeft: 25,
    color: 'black',
  },
  textContents: {
    fontSize: 30,
    margin: 30,
    color: 'black',
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: 'grey',
  },

  // Boxes and panels
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  detailsPanel: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    margin:10
  },
  detailsTitle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailsContent: {
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  titleBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#7d7d7dff',
    borderWidth: 1,
    height: 40,
    marginBottom: 10,
  },
  smallButton: {
     backgroundColor: '#ffffffff',
     borderColor: '#ccc',
     borderWidth: 1,
     borderRadius: 8,
     padding: 10,
  },
   smallRoundButton: {
     backgroundColor: '#ffffffff',
     alignContent:'center',
     alignItems:'center',
     borderColor: '#00000000',
     borderWidth: 1,
     borderRadius: 90,
     padding: 15,
     margin:5
  },
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },

  // Images
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  // TaskMaker page
  centerBox: {
  flex: 2,
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 20,
},

  titleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

addTaskButton: {
  backgroundColor: '#fff',
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 8,
},

addTaskButtonText: {
  fontSize: 18,
  fontWeight: '600',
  color: 'black',
},

imagePanel: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 75,          // always reserve some space
  maxHeight: 150,          // avoid it getting huge on large screens
  width: '100%',
},

imageTouchable: {
  width: '100%',
  height: '100%',
},

imageContent: {
  flex: 1,
  alignSelf: "center",
  width: "95%",
  height: undefined,
  minHeight: 75,          // always reserve some space
  maxHeight: 150,          // avoid it getting huge on large screens
  resizeMode: "contain",
  borderRadius: 6,
  borderWidth: 2,
  margin:20,
},

emptyImage: {
  flex: 1,
  width: '100%',
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#ccc',
  borderStyle: 'dashed',
  alignItems: 'center',
  justifyContent: 'center',
},

emptyImageText: {
  fontSize: 18,
  fontWeight: '600',
},

//Modal Stuff

modalOverlay: {
  flex: 1,
  justifyContent: 'flex-end', // stick to bottom
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)', // dimmed background
},
modalContent: {
  width: '90%',
  maxWidth: 400,
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 30,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalButton: {
  marginTop: 15,
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#1144bbff',
  borderRadius: 8,
},
modalButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},


});
