import { Middleware } from 'redux';
import * as A from '../actions';
import { getSnapshot } from '../auxiliary';
import { machineName } from '../MetaData';

// In order to download a machine, we simply encode a snapshot of the current
// state as JSON, create a dummy link "pointing" to this string, and click it.
export const download: Middleware = api => next => action => {
  if (action.type !== A.DOWNLOAD_MACHINE) return next(action);

  const state = api.getState();
  const snapshot = getSnapshot(state);
  const machineString = JSON.stringify(snapshot, null, '  ');
  const dataURI = `data:application/json;charset=utf-8,${encodeURIComponent(machineString)}`;
  const name = machineName(state);
  const filenameCandidate = name.toLowerCase().split(' ').join('-');
  const filename = filenameCandidate.length > 0 ? filenameCandidate : 'untitled-machine';

  const linkElt = document.createElement('a');
  linkElt.setAttribute('href', dataURI);
  linkElt.setAttribute('download', filename);
  linkElt.click();
};

// Uploading a machine involves a process similar to the download process above.
export const upload: Middleware = _ => next => action => {
  if (action.type !== A.UPLOAD_MACHINE) return next(action);

  async function installMachine(this: any) {
    uploadElt.removeEventListener('change', installMachine);
    try {
      const machineString = await this.files[0].text();
      const machine = JSON.parse(machineString);
      return next(A.installSnapshot(machine));
    } catch (_) {
      return next(A.displayMessage(
        'Upload Error',
        'We were unable to upload your machine. '
      + 'Please verify that you have selected a valid machine file.'
      ));
    }
  };

  const uploadElt = document.createElement('input');
  uploadElt.type = 'file';
  uploadElt.accept = '.json,.JSON';
  uploadElt.addEventListener('change', installMachine);
  uploadElt.click();
};
