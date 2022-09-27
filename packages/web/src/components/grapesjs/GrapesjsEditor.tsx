import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import grapesjs from 'grapesjs';
import 'grapesjs-preset-newsletter';

import 'grapesjs/dist/css/grapes.min.css';
import { Button } from '@mui/material';
import { openStdin } from 'process';
import { on } from 'events';
import Save from '@mui/icons-material/Save';
import footerPlugin from './plugins/footerPlugin';
// import webpagePlugin from 'grapesjs-preset-webpage';
import blockPlugin from 'grapesjs-blocks-basic';

import customCodePlugin from 'grapesjs-custom-code';
import navbarPlugin from 'grapesjs-navbar';
import scriptEditor from 'grapesjs-script-editor';
import FileLibraryWrapper from '../fileLibrary/FileLibraryWrapper';
import FileLibrary from '../fileLibrary/FileLibrary';
import { addTagToLink } from './addTagToLink';

export default function GrapesjsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [state, setState] = useState({ showLibrary: false, props: null });

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',

      plugins: [
        'gjs-preset-newsletter',
        footerPlugin,
        blockPlugin,
        customCodePlugin,
        navbarPlugin,
        scriptEditor,
      ],
      pluginsOpts: {
        blockPlugin: {
          stylePrefix: '', // no gjs- prefix
          flexGrid: 1, // use flexbox instead of tables
        },
      },

      storageManager: false,
    });

    if (value) {
      editor.setComponents(value);
    }

    editor.Panels.addButton('options', {
      id: 'options',
      attributes: { title: 'Save' },
      label: 'Save',
      command(editor2) {
        let html = editor2.runCommand('gjs-get-inlined-html');
        html = addTagToLink(html);
        // eslint-disable-next-line no-console
        console.log(html);
        onChange(html);
        alert('Saving to database');
      },
    });

    editor.Commands.add('open-assets', {
      run(editor2, sender, opts) {
        const assettarget = opts.target;
        // code to open your own modal goes here.
        setState({ ...state, showLibrary: true, props: opts });
      },
    });
  }, []);

  const onUpload = (urls) => {
    state.props.target.set('src', urls[0]);
    setState({ ...state, showLibrary: false, props: null });
  };
  return (
    <div>
      {state.showLibrary && (
        <FileLibraryWrapper
          open={state.showLibrary}
          onClose={() => {
            setState({ ...state, showLibrary: false });
          }}
          onUpload={onUpload}
          onDelete={() => null}
          acceptedFileType={() => null}
        />
      )}
      <div id="gjs" />
    </div>
  );
}
