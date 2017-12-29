import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository';
export default class ActionUtils {
  /**
   * navigate to repositoryDetailPage when select cell
   */
  static onSelectRepository(params) {
    const { navigate } = params.navigation;
    navigate('repositoryDetailPage', params);
  }

  /**
   * favoriteIcon click callback function
   * @param item
   * @param isFavorite
   */
  static onFavorite(favoriteDAO, item, isFavorite, flag) {
    let key =
      flag === FLAG_STORAGE.flag_trending
        ? item.fullName
        : item.full_name.toString();
    if (isFavorite) {
      favoriteDAO.saveFavoriteItem('id_' + key, JSON.stringify(item));
    } else {
      favoriteDAO.removeFavoriteItem('id_' + key, JSON.stringify(item));
    }
  }
}
