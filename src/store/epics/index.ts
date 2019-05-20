import userEpic from './user.epic';
import tipEpic from './tip.epic';
import uploadEpic from './upload.epic';
import articleEpic from './article.epic';

export default {
    ...userEpic,
    ...tipEpic,
    ...uploadEpic,
    ...articleEpic,
}
