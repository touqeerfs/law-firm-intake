import { useSyncExternalStore } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getContactsRepository } from './browser-repository';
import type { ResetMode } from './contacts-repository';
import {
  readNetworkMode,
  subscribeToNetworkMode,
  writeNetworkMode,
  type NetworkMode,
} from './network-mode';

type DataAction = ResetMode | 'corrupt';

function serverNetworkMode(): NetworkMode {
  return 'normal';
}

export function useDemoControls() {
  const queryClient = useQueryClient();
  const networkMode = useSyncExternalStore(
    subscribeToNetworkMode,
    readNetworkMode,
    serverNetworkMode,
  );

  // Reset rather than invalidate, so cached data is dropped and the loading state shows again
  function reloadAll() {
    return queryClient.resetQueries();
  }

  const dataMutation = useMutation({
    mutationFn: (action: DataAction) => {
      const repository = getContactsRepository();
      return action === 'corrupt' ? repository.corruptData() : repository.resetData(action);
    },
    onSettled: reloadAll,
  });

  function changeNetworkMode(mode: NetworkMode) {
    writeNetworkMode(mode);
    void reloadAll();
  }

  return { networkMode, changeNetworkMode, changeData: dataMutation.mutate };
}
