import VREStore from './vreditor'
import {
  DescriptionUIStore,
  ImageUploadUIStore,
  ObjectUploadUIStore,
  CircleObjectUIStore,
  AudioUploadUIStore,
  AudioPlayerUIStore,
  YoutubeResultsUIStore,
  YouTubeVideoPreviewStore,
  BackgroundAudioUIStore,
  SceneUIStore,
  CircleUIStore,
  SharingEditorUIStore,
  ShowWhen
} from './vreditorui'

export default {
  app: new VREStore(),
  ui: {
    description: new DescriptionUIStore(),
    imageupload: new ImageUploadUIStore(),
    objectupload: new ObjectUploadUIStore(),
    circleobject: new CircleObjectUIStore(),
    audioupload: new AudioUploadUIStore(),
    audioplayer: new AudioPlayerUIStore(),
    youtube: new YoutubeResultsUIStore(),
    ytpreview: new YouTubeVideoPreviewStore(),
    backgroundaudio: new BackgroundAudioUIStore(),
    sceneeditor: new SceneUIStore(),
    circle: new CircleUIStore(),
    sharing: new SharingEditorUIStore(),
    showwhen: new ShowWhen()
  }
}
