<?php include('header.tpl'); ?>
<?php include('search_box.tpl'); ?>
<ul>
<?php foreach($result as $dir => $value): ?>
	<li><h2><?php echo $dir; ?></h2>
	<ul>
	<?php foreach($value as $v): ?>
		<li>
			<h3><a href="<?php echo $v['link']; ?>"><?php echo $v['word']; ?></a></h3>
		</li>
	<?php endforeach; ?>
	</ul>
	</li>
</ul>	
<?php endforeach; ?>
<?php include('footer.tpl'); ?>
