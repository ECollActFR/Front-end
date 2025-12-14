import InfiniteList from '@/components/InfiniteList';
import ClientAccountCard from './ClientAccountCard';
import { ClientAccount } from '@/types/clientAccount';
import { useTranslation } from '@/hooks/useTranslation';

interface ClientAccountListProps {
  data: ClientAccount[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onClientAccountPress: (clientAccount: ClientAccount) => void;
  onEditClientAccount?: (clientAccount: ClientAccount) => void;
  onDeleteClientAccount?: (clientAccount: ClientAccount) => void;
  onViewUsers?: (clientAccount: ClientAccount) => void;
}

export default function ClientAccountList({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  error,
  onRefresh,
  isRefreshing,
  onClientAccountPress,
  onEditClientAccount,
  onDeleteClientAccount,
  onViewUsers,
}: ClientAccountListProps) {
  const { t } = useTranslation();

  const renderItem = ({ item, index }: { item: ClientAccount; index: number }) => (
    <ClientAccountCard
      clientAccount={item}
      index={index}
      onPress={() => onClientAccountPress(item)}
      onEdit={onEditClientAccount ? () => onEditClientAccount(item) : undefined}
      onDelete={onDeleteClientAccount ? () => onDeleteClientAccount(item) : undefined}
      onViewUsers={onViewUsers ? () => onViewUsers(item) : undefined}
    />
  );

  return (
    <InfiniteList
      data={data}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      renderItem={renderItem}
      emptyMessage={t.admin.noClientAccounts}
      loadingMoreText={t.admin.loadingMore}
      keyExtractor={(item: ClientAccount) => item.id.toString()}
    />
  );
}