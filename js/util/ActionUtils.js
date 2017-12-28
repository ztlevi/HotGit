export default class ActionUtils {
  /**
   * navigate to repositoryDetailPage when select cell
   */
  static onSelectRepository(params) {
    const { navigate } = params.navigation;
    navigate('repositoryDetailPage', params);
  }
}
