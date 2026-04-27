import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

export interface PickedContact {
  id: string;
  name: string;
  avatarUrl?: string;
  phoneOrEmail?: string;
}

export const getAllDeviceContacts = async (): Promise<PickedContact[]> => {
  try {
    if (Platform.OS === 'android') {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Accept',
        }
      );
      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        return [];
      }
    } else {
      const permission = await Contacts.requestPermission();
      if (permission !== 'authorized') {
        return [];
      }
    }

    console.log("Hey there")

    const contacts = await Contacts.getAll();

    console.log(contacts, "contactssssss")

    // Normalize and filter contacts (only those with names and at least one contact method)
    return contacts
      .filter(c => c.displayName || c.givenName)
      .map(c => {
        let phoneOrEmail = undefined;
        if (c.phoneNumbers && c.phoneNumbers.length > 0) {
          phoneOrEmail = c.phoneNumbers[0].number;
        } else if (c.emailAddresses && c.emailAddresses.length > 0) {
          phoneOrEmail = c.emailAddresses[0].email;
        }

        return {
          id: c.recordID,
          name: c.displayName || `${c.givenName} ${c.familyName}`.trim(),
          avatarUrl: c.hasThumbnail ? c.thumbnailPath : undefined,
          phoneOrEmail,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};
